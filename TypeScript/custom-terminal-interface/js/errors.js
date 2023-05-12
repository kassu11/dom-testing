"use strict";
function addErrorText(text) {
    const span = document.createElement("span");
    span.textContent = text + "\n";
    span.classList.add("error");
    textContentElem.append(span);
}
function hasErrors(commands, path, baseCommand) {
    const errorIndex = path.findIndex(p => p === null);
    const lastKey = (path.at(-1)?.next || "");
    if (errorIndex !== -1)
        return `Invalid argument "${commands[errorIndex]}"`;
    else if (baseCommand.commands[lastKey]?.type === "required")
        return "Give more arguments";
}
//# sourceMappingURL=errors.js.map