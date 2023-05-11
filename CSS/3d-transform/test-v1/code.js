const scene = document.querySelector("#scene");
const box = scene.querySelector(".box");

document.querySelector("#sides form").addEventListener("input", function () {
	const formData = Object.fromEntries(new FormData(this));
	this.querySelectorAll("input").forEach(({ value }) => box.classList.remove(value));

	box.classList.add(formData.side)
});

document.querySelector("#location form").addEventListener("input", function () {
	const formData = Object.fromEntries(new FormData(this));
	this.querySelectorAll("input").forEach(({ value }) => box.classList.remove(value));

	box.classList.add(formData.location)
});

document.querySelector("#parameters form").addEventListener("input", function (e) {
	const formData = Object.fromEntries(new FormData(this));

	scene.style.perspective = formData.perspective + "px";
	box.style.width = formData.width + "px";
	box.style.height = formData.height + "px";
	box.style.setProperty("--depth", formData.depth + "px");
});
