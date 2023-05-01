"use strict";
const caretHistory = {
    "lastMoved": performance.now(),
    "lastPosition": 0,
};
function updateCaret() {
    caret.textContent = input.value.substring(0, input.selectionStart || 0);
    if (input.selectionStart !== caretHistory.lastPosition) {
        caretHistory.lastMoved = performance.now();
        caretHistory.lastPosition = input.selectionStart || 0;
        updateIntellisense();
        caret.classList.remove("idle");
        caret.style.setProperty("--left", caret.getBoundingClientRect().width + "px");
    }
    else if (performance.now() - caretHistory.lastMoved > 1000) {
        caret.classList.add("idle");
    }
    window.requestAnimationFrame(updateCaret);
}
function carretIntoView() {
    updateCaret();
    commandInterfaceContainer.querySelector(".caret")?.scrollIntoView({ inline: "end" });
    input.scrollLeft = commandInterfaceContainer.scrollLeft;
}
window.requestAnimationFrame(updateCaret);
//# sourceMappingURL=carret.js.map