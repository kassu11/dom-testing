const GRID_SIZE = 32;

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

const encoder = device.createCommandEncoder();

const pass = encoder.beginRenderPass({
	colorAttachments: [{
		view: context.getCurrentTexture().createView(),
		clearValue: { r: 0, g: 0, b: 0.2, a: 1 },
		loadOp: "clear",
		storeOp: "store",
	}]
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

const uniformArray = new Float32Array([GRID_SIZE, GRID_SIZE]);
const uniformBuffer = device.createBuffer({
	label: "Grid Uniforms",
	size: uniformArray.byteLength,
	usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
});

const vertexBufferLayout = {
	arrayStride: 8,
	attributes: [{
		format: "float32x2",
		offset: 0,
		shaderLocation: 0, // Position, see vertex shader
	}],
};

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

	@vertex
	fn vertexMain(input: VertexInput) -> VertexOutput {
		let i = f32(input.instance);
		let cell = vec2f(i % grid.x, floor(i / grid.y));
		let cellOffset = cell / grid * 2;
		let gridPos = (input.pos + 1) / grid - 1 + cellOffset;

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

const cellPipeline = device.createRenderPipeline({
	label: "Cell pipeline",
	layout: "auto",
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

const bindGroup = device.createBindGroup({
	label: "Cell renderer bind group",
	layout: cellPipeline.getBindGroupLayout(0),
	entries: [{
		binding: 0,
		resource: { buffer: uniformBuffer }
	}],
});


device.queue.writeBuffer(vertexBuffer, /*bufferOffset=*/0, vertices);
device.queue.writeBuffer(uniformBuffer, 0, uniformArray);

pass.setPipeline(cellPipeline);
pass.setVertexBuffer(0, vertexBuffer);
pass.setBindGroup(0, bindGroup);
pass.draw(vertices.length / 2, GRID_SIZE * GRID_SIZE);

pass.end();
device.queue.submit([encoder.finish()]);