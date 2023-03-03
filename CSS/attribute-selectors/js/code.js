document.querySelectorAll("a").forEach(element => {
	const textContent = element.textContent;
	element.textContent = "a";

	[...element.attributes].forEach(attripute => {
		if (!attripute) return;
		const attribute = document.createElement("span");
		attribute.classList.add("attribute");
		attribute.textContent = " " + attripute.name;

		const value = document.createElement("span");
		value.classList.add("value");
		value.textContent = attripute.value;

		element.append(attribute);
		if (attripute.value) element.append(value);
	});

	const textElement = document.createElement("span");
	textElement.classList.add("text");
	textElement.textContent = ">" + textContent + "</";
	element.append(textElement);
});

document.querySelector("#cssCodeBlock1 code").textContent = `a[href$="firstLink" i] {
	select: true
}`;

document.querySelector("#cssCodeBlock2 code").textContent = `a[class*="firstLink"] {
	select: true
}`;

document.querySelector("#cssCodeBlock3 code").textContent = `a[class~="löydä"] {
	select: true
}`;