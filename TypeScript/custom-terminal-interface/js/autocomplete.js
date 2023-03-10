"use strict";
const tooltip = document.getElementById("tooltip");
const autocorrect = document.getElementById("autocorrect");
const intelisense = {
    "index": 0,
    "options": [],
};
input.addEventListener("input", e => {
    tooltip.textContent = "";
    const currentCommand = input.value.substring(0, input.selectionStart || 0).split(" ");
    let localCommands = Object.values(commands);
    for (const index in currentCommand) {
        localCommands = filterData(localCommands, currentCommand[index], +index, +index < currentCommand.length - 1);
    }
    intelisense.options = [];
    localCommands.forEach(value => {
        if (currentCommand.length === 1)
            return intelisense.options.push({ title: value.help, value: value.commands[0].list[0].value });
        value.commands[currentCommand.length - 1].list.forEach(({ value }) => {
            if (value.startsWith(currentCommand.at(-1) || ""))
                intelisense.options.push({ value });
        });
    });
    intelisense.options.forEach(option => {
        const span = document.createElement("span");
        span.textContent = (option.title ?? option.value) + "\n";
        tooltip.append(span);
    });
    updateCommandHightlight();
});
window.addEventListener("keydown", e => {
    if (e.key === "Tab") {
        e.preventDefault();
        if (!intelisense.options.length)
            return;
        const startText = input.value.substring(0, input.selectionStart || 0);
        const endText = input.value.substring(startText.length);
        const arr = startText.split(" ");
        arr[arr.length - 1] = ""; // Add a space
        input.value = arr.join(" ") + intelisense.options[intelisense.index].value + endText;
        commandHighlight.textContent = input.value;
    }
});
function filterData(commands, currentSection, index, strict) {
    return commands.filter((command) => {
        for (const commandValue of command.commands[index]?.list ?? []) {
            if (strict) {
                if (commandValue.value === currentSection)
                    return true;
            }
            else if (commandValue.value.startsWith(currentSection))
                return true;
        }
    });
}
function highlightToolTip() {
}
//# sourceMappingURL=autocomplete.js.map