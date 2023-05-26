function addErrorText(text: string) {
	const span = document.createElement("span")
	span.textContent = text + "\n";
	span.classList.add("error")
	textContentElem.append(span);
}

function hasErrors(commands: string[], path: any[], baseCommand: any) {
	const errorIndex = path.findIndex(p => p === null)
	const lastValidKey = (path.findLast(p => p !== null)?.next || "") as string;

	const customError = baseCommand.commands[lastValidKey]?.error?.(commands[errorIndex] ?? "") ?? "";
	if (customError && (baseCommand.commands[lastValidKey]?.type !== "optional" || commands[errorIndex]?.length)) return customError;
	if (path[errorIndex - 1]?.next == null && commands[errorIndex - 1]) {
		const extra = commands.slice(errorIndex).join(" ");
		return `The command is too long. Fix this by removing "${extra.length ? extra : ' '}" after "${commands[errorIndex - 1]}".`
	}
	if (baseCommand.commands[lastValidKey]?.type === "required") {
		if (commands[errorIndex]?.length) return `Expected ${baseCommand.commands[lastValidKey].help} but got "${commands[errorIndex]}".`
		return `Part of the command is missing, continue by adding ${baseCommand.commands[lastValidKey].help}`
	}
	if (errorIndex !== -1 && commands[errorIndex].length === 0) return `Remove empty space!`
	if (errorIndex !== -1) return `Invalid argument "${commands[errorIndex]}"!`
}

const helpTextObserver = new MutationObserver((mutationList) => {
	for (const mutation of mutationList) {
		if (mutation.removedNodes.length === 0 || tooltip.textContent?.length !== 0) continue;

		updateHelpText()
		break;
	}
});

helpTextObserver.observe(tooltip, { attributes: false, childList: true, subtree: false });