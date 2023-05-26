import { updateCounters } from "./counters.js";

export class Grid {
	constructor({ map, element, fillTiles, fillTilesName }) {
		this.map = map;
		this.width = map[0].length;
		this.fillTiles = fillTiles;
		this.fillTilesName = fillTilesName;
		this.height = map.length;
		this.container = element;
		this.tilesElem = document.querySelector("#tiles");
		this.updateContainerSize();
	}

	render() {
		this.tilesElem.innerHTML = "";
		this.map.forEach((row, y) => {
			row.forEach((tile, x) => {
				if (tile === 0) return;
				const div = document.createElement("div");
				div.classList.add("tile", "wall");
				div.style.left = `${x * 50}px`;
				div.style.top = `${y * 50}px`;
				this.tilesElem.appendChild(div);
			});
		});

		if (this.fillTiles) this.fillTiles(this);
		updateCounters();
	}

	fillRandomly() {
		this.map = this.map.map(row => row.map(() => Math.round(Math.random() - 0.4)));
		this.render();
	}

	updateContainerSize() {
		this.container.style.width = `${this.width * 50}px`;
		this.container.style.height = `${this.height * 50}px`;
	}

	updateAlgorithm(callback, name) {
		if (name === this.fillTilesName) return;
		this.fillTiles = callback;
		this.fillTilesName = name;
		this.render();
	}

	resize(width, height, direction) {
		if (width === this.width && height === this.height) return;
		if (direction === "left" && width > this.width) this.map = this.map.map(row => [...Array(width - this.width).fill(0), ...row]);
		else if (direction === "left") this.map.forEach(row => row.splice(0, this.width - width));
		else if (direction === "top" && height > this.height) this.map = [...Array(height - this.height).fill(0).map(e => [...Array(width).fill(0)]), ...this.map];
		else if (direction === "top") this.map.splice(0, this.height - height);
		else if (width > this.width) this.map = this.map.map(row => [...row, ...Array(width - this.width).fill(0)]);
		else if (width < this.width) this.map.forEach(row => row.length = width);
		else if (height > this.height) this.map = [...this.map, ...Array(height - this.height).fill(0).map(e => Array(width).fill(0))];
		else if (height < this.height) this.map.length = height;

		this.width = width;
		this.height = height;
		this.updateContainerSize();
		this.render();
	}
}