import { grid } from "./index.js";

export function boxClickEvent(element) {
	element.addEventListener("mousedown", e => {
		const border = e.target?.closest(".border");
		if (border) resizeMap(e, border);
		else modifyMap(e);
	});

	function resizeMap(event, target) {
		event.preventDefault();
		const { width, height } = element.getBoundingClientRect();
		const { x: startX, y: startY } = event;

		window.addEventListener("mousemove", move)
		window.addEventListener("mouseup", () => window.removeEventListener("mousemove", move), { once: true });

		function move(e) {
			let elemWidth = width;
			let elemHeight = height;
			if (target.id === "right") elemWidth += e.x - startX;
			else if (target.id === "left") elemWidth += startX - e.x;
			else if (target.id === "top") elemHeight += startY - e.y;
			else if (target.id === "bottom") elemHeight += e.y - startY;
			const pixelWidth = Math.max(Math.round(elemWidth / 50), 2);
			const pixelHeight = Math.max(Math.round(elemHeight / 50), 2);
			grid.resize(pixelWidth, pixelHeight, target.id);
		}
	}

	function modifyMap(event) {
		const { left, top } = element.getBoundingClientRect();
		const { x, y } = event;

		const mouseX = Math.floor((x - left) / 50);
		const mouseY = Math.floor((y - top) / 50);

		const gridValue = grid.map[mouseY]?.[mouseX];

		if (gridValue === 0) grid.map[mouseY][mouseX] = 1;
		else if (gridValue === 1) grid.map[mouseY][mouseX] = 0;

		grid.render();
	}
}