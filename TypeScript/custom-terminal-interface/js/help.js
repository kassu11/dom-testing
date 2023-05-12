"use strict";
const commandHelpElem = document.querySelector("#commandHelp");
function updateHelpText() {
    const commands = getInputValue().split(" ");
    const path = traceCommandPath([...commands, ""], false, false).filter((value) => value !== null);
    if (path.length === 0)
        return;
    const baseCommands = intellisense.command.commands;
    const helpTexts = [];
    path.forEach(value => {
        if (value?.help)
            helpTexts.push(value.help);
    });
    nextPath(path.at(-1), true);
    console.log(path, helpTexts, path);
    commandHelpElem.textContent = "";
    helpTexts.forEach((value, index) => {
        const span = document.createElement("span");
        span.textContent = value;
        commandHelpElem.append(span);
    });
    function nextPath(currentPath, skip = false) {
        const next = [];
        currentPath.list.forEach((listItem) => listItem.next && next.push(listItem.next));
        if (!skip && currentPath.help)
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