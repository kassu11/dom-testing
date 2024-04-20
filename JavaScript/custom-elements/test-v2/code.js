// Create a class for the element
class PopupInfo extends HTMLElement {
	constructor() {
		super();
	}

	connectedCallback() {
		// Create a shadow root
		const shadow = this.attachShadow({ mode: "open" });

		// Create spans
		const wrapper = document.createElement("span");
		wrapper.setAttribute("class", "wrapper");

		const icon = document.createElement("span");
		icon.setAttribute("class", "icon");
		icon.setAttribute("tabindex", 0);

		const info = document.createElement("span");
		info.setAttribute("class", "info");

		// Take attribute content and put it inside the info span
		const text = this.getAttribute("data-text");
		info.textContent = text;

		// Insert icon
		let imgUrl;
		if (this.hasAttribute("img")) {
			imgUrl = this.getAttribute("img");
		} else {
			imgUrl = "img/default.png";
		}

		const img = document.createElement("img");
		img.src = "data:image/webp;base64,UklGRqoCAABXRUJQVlA4IJ4CAACQDgCdASpAAEAAPmEukEYkIqGhKhZq6IAMCWYAxb/ajiCFuShgNsd5gP149WrodOqG9ADpbf209IDMJX4C6AlUUzfx+vbjK2uYBqcblg7qYEoKS864RfMnnOnyrLkW6UPb7w0xgUZYlI+BfnoI6l5z18T2nUUe7N3cOJ3YAAD+8H3k1lIou9qE7ZK4T/9OZDNpEk//MTzYAP/zTER8/+OH/47Fut/jshXuD0yMB60Cd2IptGj15VBpr6ntqFi5UC8NYy+/GjLDRpqSoZbgK8JXlX3H+yFxfjnO4585SNF8W5LivVbabcRYQlntAwHz86+JH4pWFT0KX340iDDP6QildON+irjr1rNuClz/jGE1dCeYkYQgfpIlQYPrdeudHF/YL/1iUWXH9SPZlgpLmLuGF8xbZSWy/1N0uOjfdcYbqKrOLgUz42fR7VpNm2BVs/IxB1eWTJ2R3oW3jiX+G0pFoZX74PnuQYzzfKNksvGDtOiTZVYxr00fJT/ReMGZN2Vnv3MhMD16dTG8dA2bINEmBPzp81uBHH03KRYD22mTzGD0WKMGiq0e8iXbjBRlnQtQnAto4Pef7k/vh/MOszBX0PDb0xMWltArrhO7A1x/sNnUdc63ifDIR9bd5FW4OGMSpGXtTMdgTEzcg1gT4CqEmYR8MCILKNa7GexCzlT4mN3HaS/vRD3xVEEvuALBCgl2eYo+YqF1egeiGi26zBpYPyDH6kfGYIuUGqE+/3QBqdhMkih/R7dvTP9/5Ie/4lk8HYTLKmysbvjoG7ilkHJSPSYvmC+xNW39sjy2VRKkJqDiHWSxMeVz0YdIamRh6teC+I/QHUdv3T93qFbRjqhuEUEP0opP1wLz6fKLldEv7Y7mcnFp0wo66RhuUAAA";
		icon.appendChild(img);

		// Create some CSS to apply to the shadow dom
		const style = document.createElement("style");
		console.log(style.isConnected);

		style.textContent = `
      .wrapper {
        position: relative;
      }

      .info {
        font-size: 0.8rem;
        width: 200px;
        display: inline-block;
        border: 1px solid black;
        padding: 10px;
        background: white;
        border-radius: 10px;
        opacity: 0;
        transition: 0.6s all;
        position: absolute;
        bottom: 20px;
        left: 10px;
        z-index: 3;
      }

      img {
        width: 1.2rem;
      }

      .icon:hover + .info, .icon:focus + .info {
        opacity: 1;
      }
    `;

		// Attach the created elements to the shadow dom
		shadow.appendChild(style);
		console.log(style.isConnected);
		shadow.appendChild(wrapper);
		wrapper.appendChild(icon);
		wrapper.appendChild(info);
	}
}
customElements.define("popup-info", PopupInfo);

document.body.append(new PopupInfo())