const tooltip = document.getElementById("tooltip") as HTMLPreElement;
const autocorrect = document.getElementById("autocorrect") as HTMLPreElement;
const intellisense = {
	"index": 0,
	"options": [] as any[],
	"renderedWordNumber": 0,
	"command": "" as any,
	"renderedWord": "" as string
}

function moveIntellisenseBox() {
	const intellisenseWord = commandHighlight.querySelector(`span[data-index="${intellisense.renderedWordNumber - 1}"]`);
	if (!intellisenseWord) return;
	const { left } = intellisenseWord.getBoundingClientRect();
	const { left: margin } = commandHighlight.getBoundingClientRect();
	const { left: padding } = commandInterfaceContainer.getBoundingClientRect();

	const value = padding + left - margin - input.scrollLeft
	const maxValue = input.getBoundingClientRect().width - tooltip.getBoundingClientRect().width

	tooltip.style.left = Math.min(Math.max(0, value), maxValue) + "px";
}

function updateIntellisense() {
	const currentCommand = input.value.substring(0, input.selectionStart || 0).split(" ");
	const prevOptionLength = intellisense.options.length;
	//@ts-ignore
	intellisense.command = commands[currentCommand[0]]; // can be undefined if one argument is given
	intellisense.options = [];
	console.log(currentCommand)
	if (currentCommand.length <= 1) {
		const rootCommands = Object.values(commands).filter(command => {
			return command.commands["index"].list.some(item => {
				return item.value.some(value => {
					return value.startsWith(currentCommand[0])
				})
			});
		});
		rootCommands.forEach((command, index) => {
			if (!intellisense.command && index === intellisense.index) intellisense.command = command;
			command.commands["index"]?.list.forEach(indexCommand => {
				indexCommand.value.forEach(value => {
					if (!value.startsWith(currentCommand[0])) return
					//@ts-ignore
					intellisense.options.push({ title: indexCommand.title || value, value });
				});
			})
		});
	} else {
		const localCommands = validCommands(currentCommand)
		localCommands.list?.forEach((listItem: any) => {
			listItem.value.forEach((value: string) => {
				if (value.startsWith(currentCommand.at(-1) || "")) intellisense.options.push({ ...listItem, value });
			});
		});
	}


	if (intellisense.options.length === 1 && intellisense.options[0]?.value === currentCommand.at(-1)) { // If the current argument is finished
		intellisense.options = [];
	}

	if (prevOptionLength !== intellisense.options.length) intellisense.index = 0;
	intellisense.options.sort((a, b) => {
		const aValue = a.title || a.value;
		const bValue = b.title || b.value;
		return aValue.localeCompare(bValue);
	});
	updateTooltip();

	if (intellisense.renderedWordNumber !== currentCommand.length) {
		const deltaSelection = Math.max((input.selectionEnd || 0) - (input.selectionStart || 0), 0);
		const autocorrentElement = commandHighlight.querySelector(".autocorrect");
		const autoTextLen = autocorrentElement?.textContent?.length || 0;
		const start = input.selectionStart || 0;
		const renderedWordLen = intellisense.renderedWord.length;
		intellisense.index = 0;

		if (start > renderedWordLen && start <= renderedWordLen + autoTextLen) {
			input.selectionStart = intellisense.renderedWord.length + 1;
			input.selectionEnd = input.selectionStart + deltaSelection;
		} else if (start > renderedWordLen) {
			input.selectionStart = start - autoTextLen;
			input.selectionEnd = input.selectionStart + deltaSelection;
		}

		removeAutocompliteText();
		if (intellisense.renderedWordNumber === 1) colorHighlight();
	}

	intellisense.renderedWordNumber = currentCommand.length;
	intellisense.renderedWord = currentCommand.join(" ");
	moveIntellisenseBox();
}

function fillInAutoComplite() {
	removeAutocompliteText();
	updateCaret(false);
	const lastSpaceIndex = input.value.indexOf(" ", input.selectionStart || 0);
	const lastSpace = lastSpaceIndex === -1 ? input.value.length : lastSpaceIndex;
	const startText = input.value.substring(0, lastSpace);
	const endText = input.value.substring(startText.length);

	const words = startText.split(" ");
	words[words.length - 1] = intellisense.options[intellisense.index].value;
	input.value = words.join(" ") + endText;
	input.selectionStart = input.selectionEnd = words.join(" ").length;
	intellisense.renderedWord = input.value.substring(0, input.selectionStart || 0);
	updateCommandHightlight(true);
	carretIntoView();
}

function validCommands(terminalCommands: any) {
	const path = traceCommandPath(terminalCommands, false);
	return path.at(-1) || {}
}

function traceCommandPath(terminalCommands: any, strictLastValue = true, giveListItem = false) {
	if (terminalCommands.length < 1) throw new Error("commands arguments length must be greater than 0");
	// @ts-ignore
	const root = commands[terminalCommands[0]] as any
	let current = root?.commands["index"];
	const path = Array(terminalCommands.length).fill(null)

	main: for (let i = 0; i < terminalCommands.length; i++) {
		const command = terminalCommands[i];
		const list = current?.list || [];

		for (const item of list) {
			if (item.match?.(command)) {
				path[i] = giveListItem ? item : current;
				current = root.commands[item.next];
				continue main;
			} else {
				const useStrict = strictLastValue || i < terminalCommands.length - 1;
				const passedStrict = useStrict && item.value.some((v: string) => v === command);
				const passedNonStrict = !useStrict && item.value.some((v: string) => v.startsWith(command));

				if (!passedStrict && !passedNonStrict) continue;
				path[i] = giveListItem ? item : current;
				current = root.commands[item.next];
				continue main;
			}
		} return path
	}
	return path
}