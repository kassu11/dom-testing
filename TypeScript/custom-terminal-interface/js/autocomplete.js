"use strict";
const tooltip = document.getElementById("tooltip");
const autocorrect = document.getElementById("autocorrect");
const intellisense = {
    "index": 0,
    "options": [],
    "renderedWordNumber": 0,
    "command": "",
    "renderedWordLeft": ""
};
function moveIntellisenseBox() {
    const intellisenseWord = commandHighlight.querySelector(`span[data-index="${intellisense.renderedWordNumber - 1}"]`);
    if (!intellisenseWord)
        return;
    const { left } = intellisenseWord.getBoundingClientRect();
    const { left: margin } = commandHighlight.getBoundingClientRect();
    const value = left - margin - input.scrollLeft;
    const maxValue = input.getBoundingClientRect().width - tooltip.getBoundingClientRect().width;
    tooltip.style.left = Math.min(Math.max(0, value), maxValue) + "px";
}
function updateIntellisense() {
    const lastSpaceIndex = input.value.indexOf(" ", input.selectionStart || 0);
    const lastSpace = lastSpaceIndex == -1 ? input.value.length : lastSpaceIndex;
    const currentCommand = input.value.substring(0, lastSpace).split(" ");
    let localCommands = Object.values(commands);
    if (currentCommand.length > 1) {
        const key = currentCommand[0];
        if (key in commands)
            localCommands = [commands[key]];
    }
    for (let index = 0; index < currentCommand.length; index++) {
        console.log(localCommands, currentCommand[index]);
        localCommands = filterData(localCommands, currentCommand[index], index, index < currentCommand.length - 1);
        console.warn(localCommands, currentCommand[index]);
        if (index === 0)
            intellisense.command = localCommands[intellisense.index];
    }
    const lastOptionLength = intellisense.options.length;
    intellisense.options = [];
    localCommands.forEach(command => {
        if (currentCommand.length === 1) {
            return command.commands[0].list[0].value.forEach((value) => {
                intellisense.options.push({ title: command.help, value });
            });
        }
        command.commands[currentCommand.length - 1].list.forEach(listItem => {
            listItem.value.forEach((value) => {
                // console.log(listItem)
                if (value.startsWith(currentCommand.at(-1) || ""))
                    intellisense.options.push({ ...listItem, value });
            });
        });
    });
    if (lastOptionLength !== intellisense.options.length)
        intellisense.index = 0;
    updateTooltip();
    if (intellisense.renderedWordNumber !== currentCommand.length) {
        const autocorrentElement = commandHighlight.querySelector(".autocorrect");
        const autoTextLen = autocorrentElement?.textContent?.length || 0;
        const start = input.selectionStart || 0;
        const renderedWordLen = intellisense.renderedWordLeft.length;
        if (start > renderedWordLen && start <= renderedWordLen + autoTextLen) {
            input.selectionStart = intellisense.renderedWordLeft.length + 1;
            input.selectionEnd = intellisense.renderedWordLeft.length + 1;
        }
        else if (start > renderedWordLen) {
            input.selectionStart = start - autoTextLen;
            input.selectionEnd = start - autoTextLen;
        }
        removeAutocompliteText();
        if (intellisense.renderedWordNumber === 1)
            colorHighlight();
    }
    intellisense.renderedWordNumber = currentCommand.length;
    intellisense.renderedWordLeft = currentCommand.join(" ");
    moveIntellisenseBox();
}
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
function filterData(commands, currentSection, index, strict) {
    return commands.filter((command) => {
        for (const commandValue of command?.commands?.[index]?.list ?? []) {
            if (strict) {
                if (commandValue.value.some((value) => value === currentSection))
                    return true;
            }
            else if (commandValue.value.some((value) => value.startsWith(currentSection)))
                return true;
            if (commandValue.match?.(currentSection))
                return true;
            console.log(commandValue.value, strict);
        }
    });
}
window.addEventListener("keydown", e => {
    if (e.key === "Tab") {
        e.preventDefault();
        if (!intellisense.options.length)
            return;
        fillInAutoComplite();
    }
    else if (e.key === "Escape") {
        removeAutocompliteText();
        tooltip.textContent = "";
    }
    else if (e.code === "Space" && e.ctrlKey) {
        removeAutocompliteText();
        updateCommandHightlight();
    }
    else if (e.key === "ArrowUp") {
        e.preventDefault();
        if (!intellisense.options.length)
            return;
        intellisense.index--;
        if (intellisense.index < 0)
            intellisense.index = intellisense.options.length - 1;
        updateCommandHightlight(true);
        updateTooltip();
    }
    else if (e.key === "ArrowDown") {
        e.preventDefault();
        if (!intellisense.options.length)
            return;
        intellisense.index++;
        if (intellisense.index > intellisense.options.length - 1)
            intellisense.index = 0;
        updateCommandHightlight(true);
        updateTooltip();
    }
});
//# sourceMappingURL=autocomplete.js.map