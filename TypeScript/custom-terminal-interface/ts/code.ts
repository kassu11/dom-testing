const input = document.querySelector("#commandInput") as HTMLInputElement;
const caret = document.querySelector(".caret") as HTMLPreElement;
const commandHighlight = document.querySelector("#commandHighlight") as HTMLPreElement;
const textContent = document.querySelector("#textContent") as HTMLPreElement;
const commandInterfaceContainer = document.querySelector("#commandInterfaceContainer") as HTMLDivElement;


const caretHistory = {
	"lastMoved": performance.now(),
	"lastPosition": 0,
}

function updateCaret() {
	caret.textContent = input.value.substring(0, input.selectionStart || 0);
	if (input.selectionStart !== caretHistory.lastPosition) {
		caretHistory.lastMoved = performance.now();
		caretHistory.lastPosition = input.selectionStart || 0;
		updateIntellisense();
		caret.classList.remove("idle")
	} else if (performance.now() - caretHistory.lastMoved > 1000) {
		caret.classList.add("idle");
	}

	window.requestAnimationFrame(updateCaret);
}

window.addEventListener("keydown", e => {
	if (e.altKey || e.ctrlKey || e.metaKey) return;
	if (e.key.includes("Arrow")) return;
	if (e.key === "Shift") return;

	if (document.activeElement !== input) input.focus();

	if (e.key === "Enter") {
		submitCommand();
	}
})

input.addEventListener("input", () => updateCommandHightlight());

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

	if (left) textContent.append(left)
	if (right) {
		textContent.append(right)
		right.innerHTML = "\n"
	}

	input.value = "";
	updateCommandHightlight()
	window.scrollBy(0, document.body.scrollHeight);
}

input.addEventListener("beforeinput", (beforeInputEvent: InputEvent) => {
	if (beforeInputEvent?.type === "beforeinput") removeAutocompliteText()
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

function updateCommandHightlight(skipIntellisense = false) {
	if (!skipIntellisense) updateIntellisense();
	const lastSpaceIndex = input.value.indexOf(" ", input.selectionStart || 0);
	const lastSpace = lastSpaceIndex == -1 ? input.value.length : lastSpaceIndex;
	const currentCommand = input.value.substring(0, lastSpace).split(" ").at(-1);

	const allWords = input.value.split(" ");
	commandHighlight.textContent = "";
	const caretLeftText = input.value.substring(0, lastSpace);
	const caretRightText = input.value.substring(lastSpace);

	const caretLeft = document.createElement("span");
	caretLeft.classList.add("left");
	const caretLeftTextArray = caretLeftText.split(" ");
	caretLeftTextArray.forEach((word, i, { length }) => {
		const span = document.createElement("span");
		span.textContent = word + (i < length - 1 ? " " : "");
		span.setAttribute("data-index", i.toString())
		caretLeft.append(span);
	});

	const caretRight = document.createElement("span");
	caretRight.classList.add("right");
	const caretRightTextArray = caretRightText.split(" ");
	caretRightTextArray.forEach((word, i, { length }) => {
		const span = document.createElement("span");
		span.textContent = word + (i < length - 1 ? " " : "");
		const index = allWords.indexOf(word, caretLeftTextArray.length + i - 1);
		span.setAttribute("data-index", (index == -1 ? caretLeftTextArray.length - 1 : index).toString())
		caretRight.append(span);
	});

	const autocorrent = document.createElement("span");
	const inteliValue = intellisense.options[intellisense.index]?.value ?? "";
	const autocorrentText = inteliValue.replace(currentCommand, "");
	autocorrent.textContent = autocorrentText;
	autocorrent.classList.add("autocorrect");

	commandHighlight.append(caretLeft, autocorrent, caretRight);

	const caretStart = input.selectionStart || 0;
	const caretEnd = input.selectionEnd || 0;

	if (input.value.length > 0 && caretRightText.length > 0) input.value = caretLeftText + " ".repeat(autocorrentText.length) + caretRightText;
	input.selectionStart = caretStart;
	input.selectionEnd = caretEnd;
	colorHighlight();
}



window.requestAnimationFrame(updateCaret);