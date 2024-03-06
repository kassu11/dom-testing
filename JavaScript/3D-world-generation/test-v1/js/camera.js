class Camera {
	constructor(playerData) {
		/** @type {WorldMap} */ this.map = playerData.map;
		/** @type {number} */ this.x = playerData.x ?? this.map.size / 2;
		/** @type {number} */ this.y = playerData.y ?? this.map.size;
		/** @type {number} */ this.z = playerData.z ?? this.map.size / 2;
		/** @type {number} */ this.renderX = this.x;
		/** @type {number} */ this.renderX = this.y;
		/** @type {number} */ this.renderX = this.z;
		/** @type {number} */ this.mouseY = playerData.mouseY ?? 0;
		/** @type {number} */ this.mouseX = playerData.mouseX ?? 180;
		/** @type {number} */ this.mouseSensitivity = playerData.mouseSensitivity ?? 0.1;
		/** @type {number} */ this.offset = this.map.size / 2 ?? 0;
		/** @type {boolean} */ this.positionMoved = false;

		/** @type {HTMLElement} */ this.viewportElem = playerData.viewportElem;
		/** @type {HTMLElement} */ this.cameraElem = playerData.cameraElem;
		/** @type {HTMLElement} */ this.skyboxCameraElem = playerData.skyboxCameraElem;
		/** @type {HTMLElement} */ this.sceneElem = this.map.scene;
		/** @type {number} */ this.perspective = playerData.perspective ?? this.viewportElem.clientHeight / 5 / Math.tan((Math.PI * 60) / 360);

		console.log(playerData.map.scene);

		this.map.renderNewChunk(this.x, this.z);

		this.updatePosition();
		this.updateFov();
	}

	updateFov = () => {
		viewportElem.style.perspective = `${this.perspective}px`;
		this.updateRotation();
	};

	updateRotation = (smooth = false) => {
		this.cameraElem.style.transition = smooth ? "transform .25s" : null;
		this.cameraElem.style.transform = `translate3d(0px, 0px, ${this.perspective}px) rotateX(${this.mouseY}deg) rotateY(${this.mouseX}deg)`;
		this.skyboxCameraElem.style.transition = smooth ? "transform .25s" : null;
		this.skyboxCameraElem.style.transform = `translate3d(0px, 0px, ${this.perspective}px) rotateX(${this.mouseY}deg) rotateY(${this.mouseX}deg)`;
	};

	updatePosition = () => {
		this.sceneElem.style.transformOrigin = `${this.x}px ${-this.y + this.offset}px ${this.z - this.offset}px`;
		this.sceneElem.style.transform = `translate3d(${-this.x}px, ${this.y - this.offset}px, ${-this.z + this.offset}px)`;
		this.positionMoved = false;
	};

	setX = (x) => {
		this.x = x;
		this.positionMoved = true;
	};

	setY = (y) => {
		this.y = y;
		this.positionMoved = true;
	};

	setZ = (z) => {
		this.z = z;
		this.positionMoved = true;
	};

	renderNewChunk = () => {
		const { x, z } = this;
		const chunk = this.map.getChunk(x, z);
		if (chunk) {
			this.map.renderChunk(chunk);
		}
	};
}
