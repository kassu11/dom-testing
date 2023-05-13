"use strict";
const caretHistory = {
    "lastMoved": performance.now(),
    "lastPosition": 0,
};
function updateCaret(intellisense = true) {
    caret.textContent = input.value.substring(0, input.selectionStart || 0);
    if (input.selectionStart !== caretHistory.lastPosition) {
        caretHistory.lastMoved = performance.now();
        caretHistory.lastPosition = input.selectionStart || 0;
        if (intellisense)
            updateIntellisense();
        caret.classList.remove("idle");
        caret.style.setProperty("--left", Math.floor(caret.getBoundingClientRect().width - input.scrollLeft) + "px");
    }
    else if (performance.now() - caretHistory.lastMoved > 1000) {
        caret.classList.add("idle");
    }
    window.requestAnimationFrame(updateCaret);
}
function carretIntoView() {
    const width = caret.getBoundingClientRect().width || 0;
    input.scrollLeft = highlightContainer.scrollLeft = width;
    updateCaret(false);
}
window.requestAnimationFrame(updateCaret);
//# sourceMappingURL=carret.js.map