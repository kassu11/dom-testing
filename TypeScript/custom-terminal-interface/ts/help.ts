const commandHelpElem = document.querySelector("#commandHelp") as HTMLPreElement;

function updateHelpText() {
	const commands = getInputValue().split(" ");
	const path = traceCommandPath(commands, false, false).filter((value: any) => value !== null);
	const selections = traceCommandPath(commands, false, true).filter((value: any) => value !== null);
	if (path.length === 0) return;

	const baseCommands = intellisense.command.commands;
	const helpTexts: string[] = [];
	commandHelpElem.classList.remove("hidden");

	path.forEach(value => "help" in value && helpTexts.push(value.help));
	if (selections.at(-1)?.next) nextPath(baseCommands[selections.at(-1).next]);

	commandHelpElem.textContent = ""
	const firstElem = commandHighlight.querySelector(`span[data-index="0"]`);
	const right = firstElem?.getBoundingClientRect().right || 0
	if (commands[1]) commandHelpElem.style.left = `${right - 10}px`;
	else commandHelpElem.style.left = `${right}px`;
	helpTexts.forEach((value, index) => {
		const prevCommandElem = commandHighlight.querySelector(`span[data-index="${index}"]`);
		const prevHelpText = commandHelpElem.children[index - 1];
		const commandRight = prevCommandElem?.getBoundingClientRect().right || 0;
		const helpRight = prevHelpText?.getBoundingClientRect().right || 0;
		const delta = Math.max(commandRight - helpRight, 0);

		const span = document.createElement("span");
		if (prevHelpText) span.style.marginLeft = `${delta}px`;
		span.textContent = value;
		commandHelpElem.append(span);
	});

	function nextPath(currentPath: any): any {
		const next: string[] = []
		currentPath.list.forEach((listItem: any) => listItem.next && next.push(listItem.next))
		if ("help" in currentPath) helpTexts.push(currentPath.help)

		if (next.length === 0) return
		if (next.every((value: string) => value === next[0])) return nextPath(baseCommands[next[0]])
		else helpTexts.push("...")
	}
}