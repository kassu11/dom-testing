const canvas = document.querySelector("canvas");

if (!navigator.gpu) {
	throw new Error("WebGPU not supported on this browser.");
}

const adapter = await navigator.gpu.requestAdapter();
if (!adapter) {
	throw new Error("No appropriate GPUAdapter found.");
}

const device = await adapter.requestDevice();

const context = canvas.getContext("webgpu");
const canvasFormat = navigator.gpu.getPreferredCanvasFormat();
context.configure({
	device: device,
	format: canvasFormat,
});

const encoder = device.createCommandEncoder();

const pass = encoder.beginRenderPass({
	colorAttachments: [{
		view: context.getCurrentTexture().createView(),
		clearValue: { r: 1, g: 0, b: 0.4, a: 1 },
		loadOp: "clear",
		storeOp: "store",
	}]
});


const vertices = new Float32Array([
	//   X,    Y,
	-0.8, -0.8, // Triangle 1 (Blue)
	0.8, -0.8,
	0.8, 0.8,

	-0.8, -0.8, // Triangle 2 (Red)
	0.8, 0.8,
	-0.8, 0.8,
]);

const vertexBuffer = device.createBuffer({
	label: "Cell vertices",
	size: vertices.byteLength,
	usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST,
});

device.queue.writeBuffer(vertexBuffer, /*bufferOffset=*/0, vertices);

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
	@vertex
	fn vertexMain(@location(0) pos: vec2f) ->
		@builtin(position) vec4f {
		return vec4f(pos.x, pos.y, 0, 1);
	}

	@fragment
	fn fragmentMain() -> @location(0) vec4f {
		return vec4f(1, 1, 0, 1); // (Red, Green, Blue, Alpha)
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


pass.setPipeline(cellPipeline);
pass.setVertexBuffer(0, vertexBuffer);
pass.draw(vertices.length / 2); // 6 vertices

pass.end();
device.queue.submit([encoder.finish()]);