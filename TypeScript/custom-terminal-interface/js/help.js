"use strict";
const commandHelpElem = document.querySelector("#commandHelp");
function updateHelpText() {
    if (!settings.commandStructureInfo) {
        commandHelpElem.classList.add("hidden");
        return;
    }
    const currentCommands = getInputValue().split(" ");
    const path = traceCommandPath(currentCommands, true, false).filter((value) => value !== null);
    const selections = traceCommandPath(currentCommands, true, true).filter((value) => value !== null);
    // @ts-ignore
    if (path.length === 0 || commands[currentCommands[0]] == null)
        return;
    const baseCommands = intellisense.command?.commands;
    const helpTexts = [];
    commandHelpElem.classList.remove("hidden");
    path.forEach(value => "help" in value && helpTexts.push(value.help));
    if (selections.at(-1)?.next)
        nextPath(baseCommands[selections.at(-1).next]);
    commandHelpElem.textContent = "";
    const firstElem = commandHighlight.querySelector(`span[data-index="0"]`);
    const right = firstElem?.getBoundingClientRect().right || 0;
    if (currentCommands[1])
        commandHelpElem.style.left = `${right - 10}px`;
    else
        commandHelpElem.style.left = `${right}px`;
    helpTexts.forEach((value, index) => {
        const prevCommandElem = commandHighlight.querySelector(`span[data-index="${index}"]`);
        const prevHelpText = commandHelpElem.children[index - 1];
        const commandRight = prevCommandElem?.getBoundingClientRect().right || 0;
        const helpRight = prevHelpText?.getBoundingClientRect().right || 0;
        const delta = Math.max(commandRight - helpRight, 0);
        const span = document.createElement("span");
        if (prevHelpText)
            span.style.marginLeft = `${delta}px`;
        if (intellisense.renderedWordNumber - 2 === index)
            span.classList.add("selected");
        else if (currentCommands[index + 1] && !path[index + 1] && path[index])
            span.classList.add("error"); // @ts-ignore
        else if (currentCommands[index + 1])
            span.classList.add("done");
        span.textContent = value;
        commandHelpElem.append(span);
    });
    function nextPath(currentPath) {
        const next = [];
        currentPath?.list.forEach((listItem) => listItem.next && next.push(listItem.next));
        if (currentPath && "help" in currentPath)
            helpTexts.push(currentPath.help);
        if (next.length === 0)
            return;
        if (next.every((value) => value === next[0]))
            return nextPath(baseCommands[next[0]]);
        else
            helpTexts.push("...");
    }
}
//# sourceMappingURL=help.js.map