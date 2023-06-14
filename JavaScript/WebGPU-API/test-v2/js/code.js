const GRID_SIZE = 32;
const UPDATE_INTERVAL = 200; // Update every 200ms (5 times/sec)
const WORKGROUP_SIZE = 8;
let step = 0; // Track how many simulation steps have been run

const canvas = document.querySelector("canvas");
const context = canvas.getContext("webgpu");

if (!navigator.gpu) throw new Error("WebGPU not supported on this browser.");

const adapter = await navigator.gpu.requestAdapter();
if (!adapter) throw new Error("No appropriate GPUAdapter found.");


const device = await adapter.requestDevice();

const canvasFormat = navigator.gpu.getPreferredCanvasFormat();
context.configure({
	device: device,
	format: canvasFormat,
});


const vertices = new Float32Array([
	// x   y
	-0.8, -0.8,
	0.8, -0.8,
	0.8, 0.8,

	-0.8, -0.8,
	0.8, 0.8,
	-0.8, 0.8,
]);
const vertexBuffer = device.createBuffer({
	label: "Cell vertices",
	size: vertices.byteLength,
	usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST,
});
const vertexBufferLayout = {
	arrayStride: 8,
	attributes: [{
		format: "float32x2",
		offset: 0,
		shaderLocation: 0, // Position, see vertex shader
	}],
};
device.queue.writeBuffer(vertexBuffer, /*bufferOffset=*/0, vertices);

const uniformArray = new Float32Array([GRID_SIZE, GRID_SIZE]);
const uniformBuffer = device.createBuffer({
	label: "Grid Uniforms",
	size: uniformArray.byteLength,
	usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
});
device.queue.writeBuffer(uniformBuffer, 0, uniformArray);

const cellStateArray = new Uint32Array(GRID_SIZE * GRID_SIZE);
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

for (let i = 0; i < cellStateArray.length; ++i) {
	cellStateArray[i] = Math.random() > 0.6 ? 1 : 0;
}

device.queue.writeBuffer(cellStateStorage[0], 0, cellStateArray);

for (let i = 0; i < cellStateArray.length; i++) {
	cellStateArray[i] = i % 2;
}

device.queue.writeBuffer(cellStateStorage[1], 0, cellStateArray);

const cellShaderModule = device.createShaderModule({
	label: "Cell shader",
	code: /* wgsl */`
	struct VertexInput {
		@location(0) pos: vec2f,
		@builtin(instance_index) instance: u32,
	};
	
	struct VertexOutput {
		@builtin(position) pos: vec4f,
		@location(0) cell: vec2f,
	};

	struct FragmentOutput {
		@location(0) pos: vec4f,
	}


	@group(0) @binding(0) var<uniform> grid: vec2f;
	@group(0) @binding(1) var<storage> cellState: array<u32>;

	@vertex
	fn vertexMain(input: VertexInput) -> VertexOutput {
		let i = f32(input.instance);
		let cell = vec2f(i % grid.x, floor(i / grid.y));
		let state = f32(cellState[input.instance]);
		let cellOffset = cell / grid * 2;
		let gridPos = (input.pos * state + 1) / grid - 1 + cellOffset;

		var output: VertexOutput;
		output.pos = vec4f(gridPos, 0, 1);
		output.cell = cell; 
		return output;
	}

	@fragment
	fn fragmentMain(input: VertexOutput) -> FragmentOutput {
		var output: FragmentOutput;
		let cell = input.cell / grid;
		output.pos = vec4f(cell, 1 - cell.x, 1); // (Red, Green, Blue, Alpha)
		return output;
	}
	`
});



const bindGroupLayout = device.createBindGroupLayout({
	label: "Cell Bind Group Layout",
	entries: [{
		binding: 0,
		visibility: GPUShaderStage.VERTEX | GPUShaderStage.FRAGMENT | GPUShaderStage.COMPUTE,
		buffer: {} // Grid uniform buffer
	}, {
		binding: 1,
		visibility: GPUShaderStage.VERTEX | GPUShaderStage.FRAGMENT | GPUShaderStage.COMPUTE,
		buffer: { type: "read-only-storage" } // Cell state input buffer
	}, {
		binding: 2,
		visibility: GPUShaderStage.COMPUTE,
		buffer: { type: "storage" } // Cell state output buffer
	}]
});

const bindGroups = [
	device.createBindGroup({
		label: "Cell renderer bind group A",
		layout: bindGroupLayout, // Updated Line
		entries: [{
			binding: 0,
			resource: { buffer: uniformBuffer }
		}, {
			binding: 1,
			resource: { buffer: cellStateStorage[0] }
		}, {
			binding: 2, // New Entry
			resource: { buffer: cellStateStorage[1] }
		}],
	}),
	device.createBindGroup({
		label: "Cell renderer bind group B",
		layout: bindGroupLayout, // Updated Line

		entries: [{
			binding: 0,
			resource: { buffer: uniformBuffer }
		}, {
			binding: 1,
			resource: { buffer: cellStateStorage[1] }
		}, {
			binding: 2, // New Entry
			resource: { buffer: cellStateStorage[0] }
		}],
	}),
];

const pipelineLayout = device.createPipelineLayout({
	label: "Cell Pipeline Layout",
	bindGroupLayouts: [bindGroupLayout],
});

const cellPipeline = device.createRenderPipeline({
	label: "Cell pipeline",
	layout: pipelineLayout, // Updated!
	vertex: {
		module: cellShaderModule,
		entryPoint: "vertexMain",
		buffers: [vertexBufferLayout]
	},
	fragment: {
		module: cellShaderModule,
		entryPoint: "fragmentMain",
		targets: [{
			format: canvasFormat
		}]
	}
});



const simulationShaderModule = device.createShaderModule({
	label: "Game of Life simulation shader",
	code: /* wgsl */`
		@group(0) @binding(0) var<uniform> grid: vec2f;

		@group(0) @binding(1) var<storage> cellStateIn: array<u32>;
		@group(0) @binding(2) var<storage, read_write> cellStateOut: array<u32>;

		fn cellIndex(cell: vec2u) -> u32 {
			return cell.y * u32(grid.x) + cell.x;
		}

		@compute @workgroup_size(${WORKGROUP_SIZE}, ${WORKGROUP_SIZE})
		fn computeMain(@builtin(global_invocation_id) cell: vec3u) {
			if (cellStateIn[cellIndex(cell.xy)] == 1) {
				cellStateOut[cellIndex(cell.xy)] = 0;
			} else {
				cellStateOut[cellIndex(cell.xy)] = 1;
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


function updateGrid() {
	const encoder = device.createCommandEncoder();
	const computePass = encoder.beginComputePass();

	computePass.setPipeline(simulationPipeline);
	computePass.setBindGroup(0, bindGroups[step % 2]);

	const workgroupCount = Math.ceil(GRID_SIZE / WORKGROUP_SIZE);
	computePass.dispatchWorkgroups(workgroupCount, workgroupCount);

	computePass.end();

	step++;

	const pass = encoder.beginRenderPass({
		colorAttachments: [{
			view: context.getCurrentTexture().createView(),
			loadOp: "clear",
			clearValue: { r: 0, g: 0, b: 0.2, a: 1 },
			storeOp: "store",
		}]
	});

	pass.setPipeline(cellPipeline);
	pass.setBindGroup(0, bindGroups[step % 2]);
	pass.setVertexBuffer(0, vertexBuffer);
	pass.draw(vertices.length / 2, GRID_SIZE * GRID_SIZE);

	pass.end();
	device.queue.submit([encoder.finish()]);
}

setInterval(updateGrid, UPDATE_INTERVAL);