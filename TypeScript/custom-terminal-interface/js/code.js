"use strict";
const input = document.querySelector("#commandInput");
const caret = document.querySelector(".caret");
const commandHighlight = document.querySelector("#commandHighlight");
const textContent = document.querySelector("#textContent");
const commandInterfaceContainer = document.querySelector("#commandInterfaceContainer");
const caretHistory = {
    "lastMoved": performance.now(),
    "lastPosition": 0,
};
function updateCaret() {
    caret.textContent = input.value.substring(0, input.selectionStart || 0);
    if (input.selectionStart !== caretHistory.lastPosition) {
        caretHistory.lastMoved = performance.now();
        caretHistory.lastPosition = input.selectionStart || 0;
        caret.classList.remove("idle");
    }
    else if (performance.now() - caretHistory.lastMoved > 1000) {
        caret.classList.add("idle");
    }
    window.requestAnimationFrame(updateCaret);
}
window.addEventListener("keydown", e => {
    if (e.altKey || e.ctrlKey || e.metaKey)
        return;
    if (e.key.includes("Arrow"))
        return;
    if (e.key === "Shift")
        return;
    if (document.activeElement !== input)
        input.focus();
    if (e.key === "Tab") {
        e.preventDefault();
        input.value += "\t";
    }
    if (e.key === "Enter") {
        submitCommand();
    }
});
input.addEventListener("input", () => {
    commandHighlight.textContent = input.value;
});
input.addEventListener("scroll", () => {
    commandInterfaceContainer.scrollLeft = input.scrollLeft;
}, { passive: true });
function submitCommand() {
    const command = input.value;
    const span = document.createElement("span");
    span.textContent = "\n" + (command || " ");
    textContent.appendChild(span);
    input.value = "";
    commandHighlight.textContent = "";
}
window.requestAnimationFrame(updateCaret);
//# sourceMappingURL=code.js.map