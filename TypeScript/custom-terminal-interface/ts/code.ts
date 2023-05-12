const input = document.querySelector("#commandInput") as HTMLInputElement;
const caret = document.querySelector(".caret") as HTMLPreElement;
const commandHighlight = document.querySelector("#commandHighlight") as HTMLPreElement;
const textContentElem = document.querySelector("#textContent") as HTMLPreElement;
const commandInterfaceContainer = document.querySelector("#commandInterfaceContainer") as HTMLDivElement;
const commandSubmitHistory = [] as string[];
let commandSubmitHistoryIndex = -1;
let commandSubmitHistoryCurrent = null as string | null;


input.addEventListener("scroll", () => {
	if (!input.matches(":focus") && input.scrollLeft === 0) {
		input.scrollLeft = commandInterfaceContainer.scrollLeft
		return; // When user on focuses, the input scroll to left 0, by default :/
	}

	commandInterfaceContainer.scrollLeft = input.scrollLeft;
	moveIntellisenseBox();
}, { passive: true });

function submitCommand() {
	const left = commandHighlight.querySelector(".left")
	const right = commandHighlight.querySelector(".right")

	colorHighlight();

	if (left) textContentElem.append(left)
	if (right) {
		textContentElem.append(right)
		right.innerHTML += "\n"
	}

	const rootKey = input.value.split(" ")[0]
	const commandIndex = commandSubmitHistory.indexOf(input.value)
	if (commandIndex !== -1) commandSubmitHistory.splice(commandIndex, 1)
	if (input.value.length) commandSubmitHistory.unshift(input.value)
	// @ts-ignore
	commands[rootKey]?.execute?.(...input.value.split(" "))
	// @ts-ignore
	if (!("execute" in (commands[rootKey] || {})) && input.value.length) {
		addErrorText(`Command "${rootKey}" not found`)
		addErrorText(`Type "help" for more information.`)
	}

	commandSubmitHistoryIndex = -1;
	commandSubmitHistoryCurrent = null;
	input.value = "";
	tooltip.textContent = "";
	updateCommandHightlight(true)
	updateCaret(false);
	window.scrollBy(0, document.body.scrollHeight);
}

input.addEventListener("beforeinput", (beforeInputEvent: InputEvent) => {
	if (beforeInputEvent?.type === "beforeinput" && input.value !== "") removeAutocompliteText()
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


function addText(text: string) {
	const span = document.createElement("span")
	span.textContent = text + "\n";
	span.classList.add("commandText")
	textContentElem.append(span);
}

function destructure(obj: any, obj2: any) {
	const copy = Object.create(
		Object.getPrototypeOf(obj),
		Object.getOwnPropertyDescriptors(obj)
	);

	return Object.assign(copy, obj2);
} 