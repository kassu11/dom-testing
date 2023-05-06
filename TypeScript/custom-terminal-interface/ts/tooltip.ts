function autoCorrectCallback(mutationList: MutationRecord[]) {
	for (const mutation of mutationList) {
		const addedNodes = mutation.addedNodes as NodeListOf<HTMLElement>;
		const removedNodes = mutation.removedNodes as NodeListOf<HTMLElement>;

		addedNodes.forEach(emptyAutoCorrect);
		removedNodes.forEach(removedAutoCorrect);
	}

	function emptyAutoCorrect(node: HTMLElement) {
		if (!node.classList?.contains("autocorrect")) return;
		if (node.textContent?.length !== 0) return;
		tooltip.textContent = "";
	}

	function removedAutoCorrect(node: HTMLElement) {
		if (!node.classList?.contains("autocorrect")) return;
		if (commandHighlight.querySelector(".autocorrect")) return;
		tooltip.textContent = "";
	}
}

// const autoCorrectObserver = new MutationObserver(autoCorrectCallback);
// autoCorrectObserver.observe(commandHighlight, { attributes: false, childList: true, subtree: false })

function tooltipCallback(mutationList: MutationRecord[]) {
	for (const mutation of mutationList) {
		const autoCorrectElement = commandHighlight.querySelector(".autocorrect") as HTMLPreElement;
		const autoCorrectLength = autoCorrectElement?.textContent?.length ?? 0;
		if (mutation.addedNodes.length && autoCorrectLength === 0) {
			tooltip.textContent = "";
		}
	}
}

// const tooltipObserver = new MutationObserver(tooltipCallback);
// tooltipObserver.observe(tooltip, { attributes: false, childList: true, subtree: false })

tooltip.addEventListener("click", e => {
	const target = e.target as HTMLElement;
	const selection = target?.closest("#tooltip > span");
	if (!selection) return;

	const index = parseInt(selection.getAttribute("data-index") || "0");
	intellisense.index = index;
	fillInAutoComplite();
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