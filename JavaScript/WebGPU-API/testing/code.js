const SIMULATION_WIDTH = 400;
const SIMULATION_HEIGHT = 200;
const CANVAS_WIDTH = 80;
const CANVAS_HEIGHT = 40;
const PIXEL_SIZE = 20;

const WORKGROUP_SIZE = 8;
let step = 0;

const canvas = document.querySelector("canvas");
const context = canvas.getContext("webgpu");
canvas.width = CANVAS_WIDTH * PIXEL_SIZE;
canvas.height = CANVAS_HEIGHT * PIXEL_SIZE;

if (!navigator.gpu) throw new Error("WebGPU not supported on this browser.");

const adapter = await navigator.gpu.requestAdapter();
if (!adapter) throw new Error("No appropriate GPUAdapter found.");

const device = await adapter.requestDevice();
const canvasFormat = navigator.gpu.getPreferredCanvasFormat();
context.configure({
	device: device,
	format: canvasFormat,
});

const encoder = device.createCommandEncoder();

const minCubeMargin = Math.min(canvas.width, canvas.height) * .8
const y = minCubeMargin / canvas.height
const x = minCubeMargin / canvas.width

const gridUniforms = new Float32Array([CANVAS_WIDTH, CANVAS_HEIGHT]);
const gridUniformBuffer = device.createBuffer({
	label: "Grid Uniforms",
	size: gridUniforms.byteLength,
	usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
});
const simulationUniforms = new Float32Array([SIMULATION_WIDTH, SIMULATION_HEIGHT]);
const simulationUniformBuffer = device.createBuffer({
	label: "Simulation size Uniforms",
	size: simulationUniforms.byteLength,
	usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
});

device.queue.writeBuffer(gridUniformBuffer, 0, gridUniforms);
device.queue.writeBuffer(simulationUniformBuffer, 0, simulationUniforms);

const positionArray = new Float32Array([0, 0]);
const positionBuffer = device.createBuffer({
	label: "Position buffer",
	size: positionArray.byteLength,
	usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST,
});
device.queue.writeBuffer(positionBuffer, 0, positionArray);

const cellStateArray = new Uint32Array(SIMULATION_WIDTH * SIMULATION_HEIGHT);
const cellStateStorage = [
	device.createBuffer({
		label: "Cell State A",
		size: cellStateArray.byteLength,
		usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST,
	}),
	device.createBuffer({
		label: "Cell State B",
		size: cellStateArray.byteLength,
		usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST,
	})
];

for (let i = 0; i < cellStateArray.length; i++) {
	cellStateArray[i] = Math.random() > 0.6 ? 1 : 0;
}

device.queue.writeBuffer(cellStateStorage[0], 0, cellStateArray);


const cubeVertices = new Float32Array([
	x, -y, x, y, -x, -y,
	-x, y, x, y, -x, -y
]);

const cubeVertexBuffer = device.createBuffer({
	label: "Cube vertices",
	size: cubeVertices.byteLength,
	usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST,
});

device.queue.writeBuffer(cubeVertexBuffer, 0, cubeVertices);

const cubeVertexBufferLayout = {
	arrayStride: 8, // x and y values take up 4 bytes each
	attributes: [{
		format: "float32x2",
		offset: 0,
		shaderLocation: 0,
	}],
};

const bindGroupLayout = device.createBindGroupLayout({
	label: "Cube grid bind group layout",
	entries: [{
		binding: 0,
		visibility: GPUShaderStage.VERTEX | GPUShaderStage.FRAGMENT | GPUShaderStage.COMPUTE,
		buffer: {}
	},
	{
		binding: 1,
		visibility: GPUShaderStage.VERTEX | GPUShaderStage.FRAGMENT | GPUShaderStage.COMPUTE,
		buffer: {}
	},
	{
		binding: 2,
		visibility: GPUShaderStage.VERTEX,
		buffer: { type: "read-only-storage" }
	},
	{
		binding: 3,
		visibility: GPUShaderStage.VERTEX | GPUShaderStage.COMPUTE,
		buffer: { type: "read-only-storage" } // Cell state input buffer
	},
	{
		binding: 4,
		visibility: GPUShaderStage.COMPUTE,
		buffer: { type: "storage" } // Cell state output buffer
	}]
});

const cubeShaderModule = device.createShaderModule({
	label: "Cube shader",
	code: /* wgsl */ `
		@group(0) @binding(0) var<uniform> grid: vec2f;
		@group(0) @binding(1) var<uniform> simulation: vec2f;
		@group(0) @binding(2) var<storage> gridPos: vec2f;
		@group(0) @binding(3) var<storage> cellState: array<u32>;

		struct VertexInput {
			@location(0) pos: vec2f,
			@builtin(instance_index) instance: u32,
		}

		struct VertexOutput {
			@builtin(position) pos: vec4f,
			@location(0) cell: vec2f,
		}

		@vertex fn vertexMain(input: VertexInput) -> VertexOutput {
			var output: VertexOutput;

			let i = f32(input.instance);
			let cell = vec2f(i % simulation.x, floor(i / simulation.x));
			let scale = min(grid.x, grid.y);
			let state = f32(cellState[input.instance]);
			let offset = cell / grid * 2 + 1 / grid;
			output.pos = vec4f(input.pos * state / scale - 1 + offset + gridPos, 0, 1);
			output.cell = cell;
			return output;
		}

		@fragment fn fragmentMain(input: VertexOutput) -> @location(0) vec4f {
			let color = input.cell / grid;
			return vec4f(color, 1 - color.y, 1.0);
		}
	`
});

const pipelineLayout = device.createPipelineLayout({
	label: "Cell Pipeline Layout",
	bindGroupLayouts: [bindGroupLayout],
});

const cubePipeline = device.createRenderPipeline({
	label: "Cube pipeline",
	layout: pipelineLayout,
	vertex: {
		module: cubeShaderModule,
		entryPoint: "vertexMain",
		buffers: [cubeVertexBufferLayout]
	},
	fragment: {
		module: cubeShaderModule,
		entryPoint: "fragmentMain",
		targets: [{
			format: canvasFormat
		}]
	},
});

const simulationShaderModule = device.createShaderModule({
	label: "Game of Life simulation shader",
	code: /* wgsl */`
		@group(0) @binding(1) var<uniform> grid: vec2f;

		@group(0) @binding(3) var<storage> cellStateIn: array<u32>;
		@group(0) @binding(4) var<storage, read_write> cellStateOut: array<u32>;

		fn cellIndex(cell: vec2u) -> u32 {
			return (cell.y % u32(grid.y)) * u32(grid.x) +
						 (cell.x % u32(grid.x));
		}

		fn cellActive(x: u32, y: u32) -> u32 {
			return cellStateIn[cellIndex(vec2(x, y))];
		}

		@compute @workgroup_size(${WORKGROUP_SIZE}, ${WORKGROUP_SIZE})
		fn computeMain(@builtin(global_invocation_id) cell: vec3u) {
			let activeNeighbors = cellActive(cell.x + 1, cell.y + 1) +
				cellActive(cell.x + 1, cell.y) +
				cellActive(cell.x + 1, cell.y - 1) +
				cellActive(cell.x, cell.y - 1) +
				cellActive(cell.x - 1, cell.y - 1) +
				cellActive(cell.x - 1, cell.y) +
				cellActive(cell.x - 1, cell.y + 1) +
				cellActive(cell.x, cell.y + 1);

			let i = cellIndex(cell.xy);

			// Conway's game of life rules:
			switch activeNeighbors {
				case 2: { // Active cells with 2 neighbors stay active.
					cellStateOut[i] = cellStateIn[i];
				}
				case 3: { // Cells with 3 neighbors become or stay active.
					cellStateOut[i] = 1;
				}
				default: { // Cells with < 2 or > 3 neighbors become inactive.
					cellStateOut[i] = 0;
				}
			}
		}
		`
});

const simulationPipeline = device.createComputePipeline({
	label: "Simulation pipeline",
	layout: pipelineLayout,
	compute: {
		module: simulationShaderModule,
		entryPoint: "computeMain",
	}
});

let bindGroups = [];

updateCanvas();

canvas.addEventListener("mousedown", e => {
	e.preventDefault();
	window.addEventListener("mousemove", move);
	window.addEventListener("mouseup", () => window.removeEventListener("mousemove", move), { once: true });
	const rect = canvas.getBoundingClientRect();
	const x = e.x;
	const y = e.y;
	const startX = positionArray[0];
	const startY = positionArray[1];

	function move(e) {
		if (e.buttons === 0) {
			window.removeEventListener("mousemove", move);
			return;
		}

		const dx = (e.x - x) / rect.width * 2 + startX;
		const dy = (e.y - y) / rect.height * -2 + startY;
		positionArray[0] = dx;
		positionArray[1] = dy;

		updateCanvas();
	}
})



function updateCanvas() {
	const encoder = device.createCommandEncoder();

	const pass = encoder.beginRenderPass({
		colorAttachments: [{
			view: context.getCurrentTexture().createView(),
			loadOp: "clear",
			clearValue: [0, 0, 0, 1],
			storeOp: "store",
		}]
	});

	device.queue.writeBuffer(positionBuffer, 0, positionArray);

	bindGroups = [
		device.createBindGroup({
			label: "Cube grid bind group A",
			layout: bindGroupLayout,
			entries: [{
				binding: 0,
				resource: { buffer: gridUniformBuffer }
			},
			{
				binding: 1,
				resource: { buffer: simulationUniformBuffer }
			},
			{
				binding: 2,
				resource: { buffer: positionBuffer }
			},
			{
				binding: 3,
				resource: { buffer: cellStateStorage[0] }
			},
			{
				binding: 4,
				resource: { buffer: cellStateStorage[1] }
			}]
		}),
		device.createBindGroup({
			label: "Cube grid bind group B",
			layout: bindGroupLayout,
			entries: [{
				binding: 0,
				resource: { buffer: gridUniformBuffer }
			},
			{
				binding: 1,
				resource: { buffer: simulationUniformBuffer }
			},
			{
				binding: 2,
				resource: { buffer: positionBuffer }
			},
			{
				binding: 3,
				resource: { buffer: cellStateStorage[1] }
			},
			{
				binding: 4,
				resource: { buffer: cellStateStorage[0] }
			}]
		})
	];

	pass.setPipeline(cubePipeline);
	pass.setBindGroup(0, bindGroups[step % 2]);
	pass.setVertexBuffer(0, cubeVertexBuffer);
	pass.draw(cubeVertices.length / 2, SIMULATION_WIDTH * SIMULATION_HEIGHT);

	pass.end();
	device.queue.submit([encoder.finish()]);
}

setInterval(e => {
	const encoder = device.createCommandEncoder();
	const computePass = encoder.beginComputePass();

	computePass.setPipeline(simulationPipeline);
	computePass.setBindGroup(0, bindGroups[step++ % 2]);

	const workgroupCount = Math.ceil(Math.max(SIMULATION_WIDTH, SIMULATION_HEIGHT) / WORKGROUP_SIZE);
	computePass.dispatchWorkgroups(workgroupCount, workgroupCount);

	computePass.end();

	const pass = encoder.beginRenderPass({
		colorAttachments: [{
			view: context.getCurrentTexture().createView(),
			loadOp: "clear",
			clearValue: [0, 0, 0, 1],
			storeOp: "store",
		}]
	});

	device.queue.writeBuffer(positionBuffer, 0, positionArray);

	bindGroups = [
		device.createBindGroup({
			label: "Cube grid bind group A",
			layout: bindGroupLayout,
			entries: [{
				binding: 0,
				resource: { buffer: gridUniformBuffer }
			},
			{
				binding: 1,
				resource: { buffer: simulationUniformBuffer }
			},
			{
				binding: 2,
				resource: { buffer: positionBuffer }
			},
			{
				binding: 3,
				resource: { buffer: cellStateStorage[0] }
			},
			{
				binding: 4,
				resource: { buffer: cellStateStorage[1] }
			}]
		}),
		device.createBindGroup({
			label: "Cube grid bind group B",
			layout: bindGroupLayout,
			entries: [{
				binding: 0,
				resource: { buffer: gridUniformBuffer }
			},
			{
				binding: 1,
				resource: { buffer: simulationUniformBuffer }
			},
			{
				binding: 2,
				resource: { buffer: positionBuffer }
			},
			{
				binding: 3,
				resource: { buffer: cellStateStorage[1] }
			},
			{
				binding: 4,
				resource: { buffer: cellStateStorage[0] }
			}]
		})
	];

	pass.setPipeline(cubePipeline);
	pass.setBindGroup(0, bindGroups[step % 2]);
	pass.setVertexBuffer(0, cubeVertexBuffer);
	pass.draw(cubeVertices.length / 2, SIMULATION_WIDTH * SIMULATION_HEIGHT);

	pass.end();
	device.queue.submit([encoder.finish()]);
}, 100);