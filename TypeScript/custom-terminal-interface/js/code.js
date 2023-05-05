"use strict";
const input = document.querySelector("#commandInput");
const caret = document.querySelector(".caret");
const commandHighlight = document.querySelector("#commandHighlight");
const textContentElem = document.querySelector("#textContent");
const commandInterfaceContainer = document.querySelector("#commandInterfaceContainer");
window.addEventListener("keydown", e => {
    if (e.ctrlKey && e.code == "KeyV")
        input.focus();
    if (e.altKey || e.ctrlKey || e.metaKey)
        return;
    if (e.key.includes("Arrow"))
        return;
    if (e.key === "Shift")
        return;
    if (document.activeElement !== input)
        input.focus();
    if (e.key === "Enter")
        submitCommand();
});
input.addEventListener("scroll", () => {
    if (!input.matches(":focus") && input.scrollLeft === 0) {
        input.scrollLeft = commandInterfaceContainer.scrollLeft;
        return; // When user on focuses, the input scroll to left 0, by default :/
    }
    commandInterfaceContainer.scrollLeft = input.scrollLeft;
    moveIntellisenseBox();
}, { passive: true });
function submitCommand() {
    const left = commandHighlight.querySelector(".left");
    const right = commandHighlight.querySelector(".right");
    colorHighlight();
    if (left)
        textContentElem.append(left);
    if (right) {
        textContentElem.append(right);
        right.innerHTML += "\n";
    }
    const rootKey = intellisense.renderedWord.split(" ")[0];
    // @ts-ignore
    commands[rootKey]?.execute?.(...input.value.split(" "));
    input.value = "";
    updateCommandHightlight();
    window.scrollBy(0, document.body.scrollHeight);
}
input.addEventListener("beforeinput", (beforeInputEvent) => {
    if (beforeInputEvent?.type === "beforeinput")
        removeAutocompliteText();
});
function removeAutocompliteText() {
    const text = commandHighlight.querySelector(".left")?.textContent?.length || 0;
    const auto = commandHighlight.querySelector(".autocorrect")?.textContent?.length || 0;
    const start = input.value.substring(0, text);
    const end = input.value.substring(text + auto);
    const caretStart = input.selectionStart || 0;
    const caretEnd = input.selectionEnd || 0;
    input.value = start + end;
    commandHighlight.querySelector(".autocorrect")?.remove();
    input.selectionStart = caretStart;
    input.selectionEnd = caretEnd;
}
function addText(text) {
    const span = document.createElement("span");
    span.textContent = text + "\n";
    span.classList.add("commandText");
    textContentElem.append(span);
}
function addErrorText(text) {
    const span = document.createElement("span");
    span.textContent = text + "\n";
    span.classList.add("error");
    textContentElem.append(span);
}
//# sourceMappingURL=code.js.map