"use strict";
const tooltip = document.getElementById("tooltip");
const autocorrect = document.getElementById("autocorrect");
const intellisense = {
    "index": 0,
    "options": [],
    "renderedWordNumber": 0,
    "command": "",
    "renderedWord": ""
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
    const prevOptionLength = intellisense.options.length;
    //@ts-ignore
    intellisense.command = commands[currentCommand[0]]; // can be undefined if one argument is given
    intellisense.options = [];
    if (currentCommand.length <= 1) {
        const rootCommands = Object.values(commands).filter(command => {
            return command.commands["index"].list.some(item => {
                return item.value.some(value => {
                    return value.startsWith(currentCommand[0]);
                });
            });
        });
        rootCommands.forEach((command, index) => {
            if (!intellisense.command && index === intellisense.index)
                intellisense.command = command;
            command.commands["index"]?.list.forEach(indexCommand => {
                indexCommand.value.forEach(value => {
                    if (!value.startsWith(currentCommand[0]))
                        return;
                    //@ts-ignore
                    intellisense.options.push({ title: indexCommand.title || command.help, value });
                });
            });
        });
    }
    else {
        const localCommands = validCommands(currentCommand);
        localCommands.list?.forEach((listItem) => {
            listItem.value.forEach((value) => {
                if (value.startsWith(currentCommand.at(-1) || ""))
                    intellisense.options.push({ ...listItem, value });
            });
        });
    }
    if (prevOptionLength !== intellisense.options.length)
        intellisense.index = 0;
    updateTooltip();
    if (intellisense.renderedWordNumber !== currentCommand.length) {
        const autocorrentElement = commandHighlight.querySelector(".autocorrect");
        const autoTextLen = autocorrentElement?.textContent?.length || 0;
        const start = input.selectionStart || 0;
        const renderedWordLen = intellisense.renderedWord.length;
        if (start > renderedWordLen && start <= renderedWordLen + autoTextLen) {
            input.selectionStart = intellisense.renderedWord.length + 1;
            input.selectionEnd = intellisense.renderedWord.length + 1;
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
    intellisense.renderedWord = currentCommand.join(" ");
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
function validCommands(terminalCommands) {
    const path = traceCommandPath(terminalCommands, false);
    return path.at(-1) || {};
}
function traceCommandPath(terminalCommands, strictLastValue = true, giveListItem = false) {
    if (terminalCommands.length < 1)
        throw new Error("commands arguments length must be greater than 0");
    // @ts-ignore
    const root = commands[terminalCommands[0]];
    let current = root?.commands["index"];
    const path = Array(terminalCommands.length).fill(null);
    main: for (let i = 0; i < terminalCommands.length; i++) {
        const command = terminalCommands[i];
        const list = current?.list || [];
        for (const item of list) {
            if (item.match?.(command)) {
                path[i] = giveListItem ? item : current;
                current = root.commands[item.next];
                continue main;
            }
            else {
                const useStrict = strictLastValue || command !== terminalCommands.at(-1) && !strictLastValue;
                const passedStrict = useStrict && item.value.some((v) => v === command);
                const passedNonStrict = !useStrict && item.value.some((v) => v.startsWith(command));
                if (!passedStrict && !passedNonStrict)
                    continue;
                path[i] = giveListItem ? item : current;
                current = root.commands[item.next];
                continue main;
            }
        }
        return path;
    }
    return path;
}
//# sourceMappingURL=autocomplete.js.map