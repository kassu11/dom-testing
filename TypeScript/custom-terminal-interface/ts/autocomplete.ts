const tooltip = document.getElementById("tooltip") as HTMLPreElement;
const autocorrect = document.getElementById("autocorrect") as HTMLPreElement;
const intellisense = {
	"index": 0,
	"options": [] as any[],
	"renderedWordNumber": 0,
	"command": "" as any,
	"renderedWordLeft": "" as string
}

function moveIntellisenseBox() {
	const intellisenseWord = commandHighlight.querySelector(`span[data-index="${intellisense.renderedWordNumber - 1}"]`);
	if (!intellisenseWord) return;
	const { left } = intellisenseWord.getBoundingClientRect();
	const { left: margin } = commandHighlight.getBoundingClientRect();

	const value = left - margin - input.scrollLeft
	const maxValue = input.getBoundingClientRect().width - tooltip.getBoundingClientRect().width

	tooltip.style.left = Math.min(Math.max(0, value), maxValue) + "px";
}

function updateIntellisense() {
	const lastSpaceIndex = input.value.indexOf(" ", input.selectionStart || 0);
	const lastSpace = lastSpaceIndex == -1 ? input.value.length : lastSpaceIndex;
	const currentCommand = input.value.substring(0, lastSpace).split(" ");

	let localCommands = Object.values(commands)
	if (currentCommand.length > 1) {
		const key = currentCommand[0] as keyof typeof commands;
		if (key in commands) localCommands = [commands[key]]
	}
	for (let index = 0; index < currentCommand.length; index++) {
		localCommands = filterData(localCommands, currentCommand[index], index, index < currentCommand.length - 1)
		if (index === 0) intellisense.command = localCommands[intellisense.index];
	}

	intellisense.options = [];
	localCommands.forEach(command => {
		if (currentCommand.length === 1) {
			return intellisense.options.push({ title: command.help, value: command.commands[0].list[0].value })
		}
		command.commands[currentCommand.length - 1].list.forEach(listItem => {
			if (listItem.value.startsWith(currentCommand.at(-1) || "")) intellisense.options.push({ ...listItem });
		});
	});

	updateTooltip();

	if (intellisense.renderedWordNumber !== currentCommand.length) {
		const autocorrentElement = commandHighlight.querySelector(".autocorrect");
		const autoTextLen = autocorrentElement?.textContent?.length || 0;
		const start = input.selectionStart || 0;
		const renderedWordLen = intellisense.renderedWordLeft.length;

		if (start > renderedWordLen && start <= renderedWordLen + autoTextLen) {
			input.selectionStart = intellisense.renderedWordLeft.length + 1;
			input.selectionEnd = intellisense.renderedWordLeft.length + 1;
		} else if (start > renderedWordLen) {
			input.selectionStart = start - autoTextLen;
			input.selectionEnd = start - autoTextLen;
		}

		removeAutocompliteText();
		if (intellisense.renderedWordNumber === 1) colorHighlight();
	}

	intellisense.renderedWordNumber = currentCommand.length;
	intellisense.renderedWordLeft = currentCommand.join(" ");
	moveIntellisenseBox();
}

function updateTooltip() {
	tooltip.textContent = "";
	intellisense.options.forEach((option, index: number) => {
		const span = document.createElement("span");
		span.setAttribute("data-index", index.toString());
		span.textContent = (option.title ?? option.value) + "\n";
		tooltip.append(span);
	});
}

window.addEventListener("keydown", e => {
	if (e.key === "Tab") {
		e.preventDefault();
		if (!intellisense.options.length) return;
		fillInAutoComplite();

	} else if (e.key === "Escape") {
		removeAutocompliteText();
		tooltip.textContent = "";
	} else if (e.code === "Space" && e.ctrlKey) {
		removeAutocompliteText();
		updateCommandHightlight();
	}
});

function fillInAutoComplite() {
	removeAutocompliteText();
	const lastSpaceIndex = input.value.indexOf(" ", input.selectionStart || 0);
	const lastSpace = lastSpaceIndex === -1 ? input.value.length : lastSpaceIndex;
	const startText = input.value.substring(0, lastSpace);
	const endText = input.value.substring(startText.length);

	const words = startText.split(" ");
	words[words.length - 1] = intellisense.options[intellisense.index].value;
	input.value = words.join(" ") + endText;
	input.selectionStart = input.selectionEnd = words.join(" ").length;
	updateCommandHightlight(true);
	carretIntoView();
	intellisense.index = 0;
}

function carretIntoView() {
	updateCaret();
	commandInterfaceContainer.querySelector(".caret")?.scrollIntoView({ inline: "end" });
	input.scrollLeft = commandInterfaceContainer.scrollLeft;
}

function filterData(commands: any, currentSection: any, index: number, strict: boolean) {
	return commands.filter((command: any) => {
		for (const commandValue of command?.commands?.[index]?.list ?? []) {
			if (strict) {
				if (commandValue.value === currentSection) return true
			} else if (commandValue.value.startsWith(currentSection)) return true
			if (commandValue.match?.(currentSection)) return true
		}
	});
}