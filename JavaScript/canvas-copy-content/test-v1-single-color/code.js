const mainCanvas = document.getElementById("main");
const mainContext = mainCanvas.getContext("2d");

const mainImage = mainContext.getImageData(0, 0, mainCanvas.width, mainCanvas.height);

document.querySelectorAll("canvas:not(#main)").forEach((canvas) => {
	const context = canvas.getContext("2d");
	context.fillStyle = "red";

	for (let i = 0; i < 5; i++) {
		const x = Math.random() * canvas.width;
		const y = Math.random() * canvas.height;
		const width = Math.random() * 100;
		const height = Math.random() * 100;

		context.fillRect(x, y, width, height);
	}

	const image = context.getImageData(0, 0, canvas.width, canvas.height);
	for (let i = 3; i < image.data.length; i += 4) {
		mainImage.data[i - 3] = 255;
		mainImage.data[i] += Math.floor(image.data[i] / 5);
	}
});

mainContext.putImageData(mainImage, 0, 0);
