"use strict";
const input = document.querySelector("#commandInput");
const caret = document.querySelector(".caret");
const highlightContainer = document.querySelector(".highlightContainer");
const commandHighlight = document.querySelector("#commandHighlight");
const textContentElem = document.querySelector("#textContent");
const commandInterfaceContainer = document.querySelector("#commandInterfaceContainer .container");
const commandSubmitHistory = [];
let commandSubmitHistoryIndex = -1;
let commandSubmitHistoryCurrent = null;
input.addEventListener("scroll", () => {
    if (!input.matches(":focus") && input.scrollLeft === 0) {
        input.scrollLeft = highlightContainer.scrollLeft;
        return; // When user on focuses, the input scroll to left 0, by default :/
    }
    highlightContainer.scrollLeft = input.scrollLeft;
    moveIntellisenseBox();
}, { passive: true });
function submitCommand() {
    const left = commandHighlight.querySelector(".left");
    const right = commandHighlight.querySelector(".right");
    colorHighlight();
    const submitContainer = document.createElement("div");
    submitContainer.classList.add("command");
    if (left)
        submitContainer.append(left);
    if (right)
        submitContainer.append(right);
    // @ts-ignore
    if (submitContainer.textContent.length > 0)
        textContentElem.append(submitContainer);
    const rootKey = input.value.split(" ")[0];
    const commandIndex = commandSubmitHistory.indexOf(input.value);
    if (commandIndex !== -1)
        commandSubmitHistory.splice(commandIndex, 1);
    if (input.value.length)
        commandSubmitHistory.unshift(input.value);
    // @ts-ignore
    commands[rootKey]?.execute?.(...input.value.split(" "));
    // @ts-ignore
    if (!("execute" in (commands[rootKey] || {})) && input.value.length) {
        addErrorText(`Command "${rootKey}" not found`);
        addErrorText(`Type "help" for more information.`);
    }
    addErrorText("");
    commandSubmitHistoryIndex = -1;
    commandSubmitHistoryCurrent = null;
    input.value = "";
    tooltip.textContent = "";
    commandHelpElem.classList.add("hidden");
    intellisense.renderedWord = "";
    updateCommandHightlight(true);
    updateCaret(false);
    textContentElem.scrollBy(0, textContentElem.scrollHeight);
}
input.addEventListener("beforeinput", (beforeInputEvent) => {
    if (beforeInputEvent?.type === "beforeinput" && input.value !== "")
        removeAutocompliteText();
});
function getInputValue() {
    const left = commandHighlight.querySelector(".left")?.textContent || "";
    const right = commandHighlight.querySelector(".right")?.textContent || "";
    return left + right;
}
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
function destructure(obj, obj2) {
    const copy = Object.create(Object.getPrototypeOf(obj), Object.getOwnPropertyDescriptors(obj));
    return Object.assign(copy, obj2);
}
addText("#######################");
addText("#                     #");
addText("#   Custom Terminal   #");
addText("#                     #");
addText("#######################");
//# sourceMappingURL=index.js.map