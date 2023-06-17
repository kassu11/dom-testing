const CANVAS_WIDTH = 8;
const CANVAS_HEIGHT = 4;
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
const pass = encoder.beginRenderPass({
	colorAttachments: [{
		view: context.getCurrentTexture().createView(),
		loadOp: "clear",
		storeOp: "store",
		clearValue: { r: 0, g: 0, b: 0.5, a: 1 },
	}]
});

const cubeVertices = new Float32Array([
	0.8, -0.8, 0.8, 0.8, -0.8, -0.8,
	-0.8, 0.8, 0.8, 0.8, -0.8, -0.8
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

const cubeShaderModule = device.createShaderModule({
	label: "Cube shader",
	code: /* wgsl */ `
		@vertex fn vertexMain(@location(0) pos: vec2f) -> @builtin(position) vec4f {
			return vec4f(pos, 0, 1);
		}

		@fragment fn fragmentMain() -> @location(0) vec4f {
			return vec4f(1.0, 0.0, 0.0, 1.0);
		}
	`
});

const cubePipeline = device.createRenderPipeline({
	label: "Cube pipeline",
	layout: "auto",
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

pass.setPipeline(cubePipeline);
pass.setVertexBuffer(0, cubeVertexBuffer);
pass.draw(cubeVertices.length / 2);

pass.end();
device.queue.submit([encoder.finish()]);