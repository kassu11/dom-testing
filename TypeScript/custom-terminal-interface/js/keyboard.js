"use strict";
window.addEventListener("keydown", e => {
    if (e.key === "Enter")
        submitCommand();
    else if (e.key === "Tab") {
        e.preventDefault();
        if (tooltip.textContent === "")
            openIntellisense();
        else if (intellisense.options.length) {
            if (caretHistory.autocompleteLocation !== false)
                moveIntellisense(e.shiftKey ? -1 : 1);
            fillInAutoComplite();
        }
    }
    else if (e.key === "Escape") {
        removeAutocompliteText();
        tooltip.textContent = "";
    }
    else if (e.code === "Space" && e.ctrlKey)
        openIntellisense();
    function openIntellisense() {
        removeAutocompliteText();
        updateCommandHightlight();
    }
    if (e.key === "ArrowUp") {
        if (tooltip.textContent === "") {
            if (commandSubmitHistoryIndex === -1)
                commandSubmitHistoryCurrent = input.value;
            if (commandSubmitHistoryIndex < commandSubmitHistory.length - 1)
                commandSubmitHistoryIndex++;
            if (commandSubmitHistory.length)
                renderCommandHistory(commandSubmitHistory[commandSubmitHistoryIndex]);
        }
        else
            moveIntellisense(-1);
    }
    else if (e.key === "ArrowDown") {
        if (tooltip.textContent === "") {
            if (commandSubmitHistoryIndex > -1)
                commandSubmitHistoryIndex--;
            if (commandSubmitHistoryIndex === -1 && commandSubmitHistoryCurrent !== null) {
                renderCommandHistory(commandSubmitHistoryCurrent);
                commandSubmitHistoryCurrent = null;
            }
            else if (commandSubmitHistoryIndex >= 0)
                renderCommandHistory(commandSubmitHistory[commandSubmitHistoryIndex]);
        }
        else
            moveIntellisense(+1);
    }
    function renderCommandHistory(command) {
        e.preventDefault();
        input.value = intellisense.renderedWord = command;
        updateCaret(false);
        updateCommandHightlight(true);
        removeAutocompliteText();
        tooltip.textContent = "";
        input.selectionStart = input.selectionEnd = input.value.length;
    }
    function moveIntellisense(directionMultipler) {
        e.preventDefault();
        if (!intellisense.options.length)
            return;
        intellisense.index += intellisense.options.length + 1 * directionMultipler;
        intellisense.index %= intellisense.options.length;
        caretHistory.autocompleteLocation = false;
        removeAutocompliteText();
        updateCommandHightlight(true);
        updateTooltip();
    }
});
window.addEventListener("keydown", e => {
    if (e.ctrlKey && e.code == "KeyV")
        input.focus();
    if (e.altKey || e.ctrlKey || e.metaKey)
        return;
    if (e.key.includes("Arrow"))
        return input.focus();
    if (e.key === "Shift")
        return;
    if (document.activeElement !== input)
        input.focus();
});
//# sourceMappingURL=keyboard.js.map