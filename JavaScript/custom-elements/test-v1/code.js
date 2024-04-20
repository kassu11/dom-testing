class Testdiv extends HTMLDivElement {
	constructor(align, text) {
		super(align);
		this.textContent = text;
		this.align = align;
		this.style = "color:red;font-Weight:bold;font-Style:italic;";
		this.contentEditable = "true";
		this.innerHTML += "<p style=color:blue;>Child</p>";
	}
};

customElements.define("test-div", Testdiv, { extends: "div" });
document.body.append(new Testdiv("right", "Custom text"));
// You can also create custom elements like this
document.body.append(document.createElement("div", "test-div"));



class MyCustomElement extends HTMLElement {
	static observedAttributes = ["color", "size"];

	constructor(textContent) {
		super();
		this.textContent = textContent;
	}

	connectedCallback() {
		console.log("Custom element added to page.");
	}

	disconnectedCallback() {
		console.log("Custom element removed from page.");
	}

	adoptedCallback() {
		console.log("Custom element moved to new page.");
	}

	attributeChangedCallback(name, oldValue, newValue) {
		console.log(`Attribute "${name}" has changed from "${oldValue}" to "${newValue}".`);
	}
}

customElements.define("my-custom-element", MyCustomElement);

document.body.append(new MyCustomElement("Custom text"));

const customElem = document.querySelector("my-custom-element");
customElem.setAttribute("color", "red"); // calls attributeChangedCallback
document.body.append(customElem); // calls remove and add

// When document changes call moved to new page
document.querySelector("iframe").contentWindow.document.body.append(customElem);