import { grid } from "./index.js";

export function resizeBox(element) {
	element.addEventListener("mousedown", e => {
		const target = e.target?.closest(".border");
		if (!target) return;

		e.preventDefault();
		const { width, height } = element.getBoundingClientRect();
		const { x: startX, y: startY } = e;

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
	});
}