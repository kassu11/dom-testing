function addErrorText(text: string) {
	const span = document.createElement("span")
	span.textContent = text + "\n";
	span.classList.add("error")
	textContentElem.append(span);
}

function hasErrors(commands: string[], path: any[], baseCommand: any) {
	const errorIndex = path.findIndex(p => p === null)
	const lastKey = (path.at(-1)?.next || "") as any
	if (errorIndex !== -1) return `Invalid argument "${commands[errorIndex]}"`
	else if (baseCommand.commands[lastKey]?.type === "required") return "Give more arguments"
}

const helpTextObserver = new MutationObserver((mutationList) => {
	for (const mutation of mutationList) {
		if (mutation.removedNodes.length === 0 || tooltip.textContent?.length !== 0) continue;

		updateHelpText()
		break;
	}
});

helpTextObserver.observe(tooltip, { attributes: false, childList: true, subtree: false });