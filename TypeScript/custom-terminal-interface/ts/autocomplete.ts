const tooltip = document.getElementById("tooltip") as HTMLPreElement;
const autocorrect = document.getElementById("autocorrect") as HTMLPreElement;
const intelisense = {
	"index": 0,
	"options": [] as any[],
}

function updateIntellisense() {
	tooltip.textContent = "";
	const lastSpaceIndex = input.value.indexOf(" ", input.selectionStart || 0);
	const lastSpace = lastSpaceIndex == -1 ? input.value.length : lastSpaceIndex;
	const currentCommand = input.value.substring(0, lastSpace).split(" ");

	let localCommands = Object.values(commands)
	for (const index in currentCommand) {
		localCommands = filterData(localCommands, currentCommand[index], +index, +index < currentCommand.length - 1)
	}

	intelisense.options = [];
	localCommands.forEach(value => {
		if (currentCommand.length === 1) return intelisense.options.push({ title: value.help, value: value.commands[0].list[0].value })
		value.commands[currentCommand.length - 1].list.forEach(({ value }) => {
			if (value.startsWith(currentCommand.at(-1) || "")) intelisense.options.push({ value });
		});
	});

	intelisense.options.forEach(option => {
		const span = document.createElement("span");
		span.textContent = (option.title ?? option.value) + "\n";
		tooltip.append(span);
	});
}

window.addEventListener("keydown", e => {
	if (e.key === "Tab") {
		e.preventDefault();
		if (!intelisense.options.length) return;
		removeAutocompliteText();
		const startText: string = input.value.substring(0, input.selectionStart || 0);
		const endText = input.value.substring(startText.length);
		const arr = startText.split(" ");
		// arr[arr.length - 1] = ""; // Add a space
		arr[arr.length - 1] = intelisense.options[intelisense.index].value;
		input.value = arr.join(" ") + endText;
		commandHighlight.textContent = input.value;
		console.log("tab", input.value)
	}
});

function filterData(commands: any, currentSection: any, index: number, strict: boolean) {
	return commands.filter((command: any) => {
		for (const commandValue of command.commands[index]?.list ?? []) {
			if (strict) {
				if (commandValue.value === currentSection) return true
			} else if (commandValue.value.startsWith(currentSection)) return true
		}
	})
}

function highlightToolTip() {

}