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
		tooltip.textContent = "";
	}
}

const autoCorrectObserver = new MutationObserver(autoCorrectCallback);
autoCorrectObserver.observe(commandHighlight, { attributes: false, childList: true, subtree: false })

function tooltipCallback(mutationList: MutationRecord[]) {
	for (const mutation of mutationList) {
		const autoCorrectElement = commandHighlight.querySelector(".autocorrect") as HTMLPreElement;
		const autoCorrectLength = autoCorrectElement?.textContent?.length ?? 0;
		if (mutation.addedNodes.length && autoCorrectLength === 0) {
			tooltip.textContent = "";
		}
	}
}

const tooltipObserver = new MutationObserver(tooltipCallback);
tooltipObserver.observe(tooltip, { attributes: false, childList: true, subtree: false })