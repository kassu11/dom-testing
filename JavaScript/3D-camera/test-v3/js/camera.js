class Camera {
	constructor(playerData) {
		/** @type {createMap} */ this.map = playerData.map;
		/** @type {number} */ this.x = playerData.x ?? this.map.size / 2;
		/** @type {number} */ this.y = playerData.y ?? 0;
		/** @type {number} */ this.z = playerData.z ?? this.map.size / 2;
		/** @type {number} */ this.mouseY = playerData.mouseY ?? 0;
		/** @type {number} */ this.mouseX = playerData.mouseX ?? 180;
		/** @type {number} */ this.mouseSensitivity = playerData.mouseSensitivity ?? 0.1;
		/** @type {number} */ this.offset = this.map.size / 2 ?? 0;
		/** @type {boolean} */ this.positionMoved = false;

		/** @type {HTMLElement} */ this.viewportElem = playerData.viewportElem;
		/** @type {HTMLElement} */ this.cameraElem = playerData.cameraElem;
		/** @type {HTMLElement} */ this.sceneElem = this.map.scene;
		/** @type {number} */ this.perspective = playerData.perspective ?? this.viewportElem.clientHeight / 5 / Math.tan(Math.PI * 60 / 360);

		this.updateFov = () => {
			viewportElem.style.perspective = `${this.perspective}px`;
			this.updateRotation();
		}

		this.updateRotation = (smooth = false) => {
			this.cameraElem.style.transition = smooth ? "transform .25s" : null;
			this.cameraElem.style.transform = `translate3d(0px, 0px, ${this.perspective}px) rotateX(${this.mouseY}deg) rotateY(${this.mouseX}deg)`;
		}

		this.updatePosition = () => {
			this.sceneElem.style.transformOrigin = `${this.x}px ${-this.y + this.offset}px ${this.z - this.offset}px`;
			this.sceneElem.style.transform = `translate3d(${-this.x}px, ${this.y - this.offset}px, ${-this.z + this.offset}px)`;
			this.positionMoved = false;
		}

		this.updatePosition();
		this.updateFov();

		return new Proxy(this, {
			get(target, key) {
				return target[key];
			},
			set(target, key, value) {
				const positions = ["x", "y", "z"];
				if (positions.includes(key)) target.positionMoved = true;
				target[key] = value;
			}
		});
	}
}