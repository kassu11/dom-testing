function generateButtons(num) {
	for (let i = 0; i < num; i++) {
		const div = document.createElement("div");
		div.classList.add("button", "left");
		div.textContent = `Button ${i + 1}`;
		document.body.append(div);
		div.addEventListener("click", toggleButtonPosition);
	}
}

function toggleButtonPosition(event) {
	const button = event.target;
	button.classList.toggle("left");
	button.classList.toggle("right");
}

generateButtons(5);