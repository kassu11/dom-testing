"use strict";
window.addEventListener("keydown", e => {
    if (e.key === "Tab") {
        e.preventDefault();
        if (tooltip.textContent === "")
            openIntellisense();
        else if (intellisense.options.length)
            fillInAutoComplite();
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
    if (e.key === "ArrowUp")
        moveIntellisense(-1);
    else if (e.key === "ArrowDown")
        moveIntellisense(+1);
    function moveIntellisense(directionMultipler) {
        e.preventDefault();
        if (!intellisense.options.length)
            return;
        intellisense.index += intellisense.options.length + 1 * directionMultipler;
        intellisense.index %= intellisense.options.length;
        removeAutocompliteText();
        updateCommandHightlight(true);
        updateTooltip();
    }
});
//# sourceMappingURL=keyboard.js.map