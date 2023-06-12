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

pass.end();
device.queue.submit([encoder.finish()]);