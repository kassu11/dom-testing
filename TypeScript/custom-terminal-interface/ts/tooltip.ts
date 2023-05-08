tooltip.addEventListener("click", e => {
	e.preventDefault();
	const target = e.target as HTMLElement;
	const selection = target?.closest("#tooltip > span");
	if (!selection) return;

	const index = parseInt(selection.getAttribute("data-index") || "0");
	intellisense.index = index;
	fillInAutoComplite();
	updateTooltip();
	input.focus();
});


function updateTooltip() {
	tooltip.textContent = "";
	intellisense.options.forEach((option, index: number) => {
		const span = document.createElement("span");
		span.setAttribute("data-index", index.toString());
		if (index === intellisense.index) span.classList.add("selected");
		span.textContent = (option.title || option.value) + "\n";

		tooltip.append(span);
	});
}