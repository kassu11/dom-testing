const CANVAS_WIDTH = 2;
const CANVAS_HEIGHT = 5;
const PIXEL_SIZE = 100;

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

device.queue.writeBuffer(gridUniformBuffer, 0, gridUniforms);

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
	arrayStride: 8,
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
		visibility: GPUShaderStage.VERTEX | GPUShaderStage.FRAGMENT,
		buffer: {}
	}]
});

const bindGroup = device.createBindGroup({
	label: "Cube grid bind group",
	layout: bindGroupLayout,
	entries: [{
		binding: 0,
		resource: {
			buffer: gridUniformBuffer
		}
	}]
});

const cubeShaderModule = device.createShaderModule({
	label: "Cube shader",
	code: /* wgsl */ `
		@group(0) @binding(0) var<uniform> grid: vec2f;

		@vertex fn vertexMain(@location(0) pos: vec2f) -> @builtin(position) vec4f {
			let cell = vec2f(0, 0);
			let scale = min(grid.x, grid.y);
			let offset = cell / grid * 2 + 1 / grid;
			return vec4f(pos / scale - 1 + offset, 0, 1);
		}

		@fragment fn fragmentMain() -> @location(0) vec4f {
			return vec4f(1.0, 0.0, 0.0, 1.0);
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

const pass = encoder.beginRenderPass({
	colorAttachments: [{
		view: context.getCurrentTexture().createView(),
		loadOp: "clear",
		storeOp: "store",
		clearValue: { r: 0, g: 0, b: 0.5, a: 1 },
	}]
});

pass.setPipeline(cubePipeline);
pass.setBindGroup(0, bindGroup);
pass.setVertexBuffer(0, cubeVertexBuffer);
pass.draw(cubeVertices.length / 2);

pass.end();
device.queue.submit([encoder.finish()]);