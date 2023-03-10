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

input.addEventListener("input", updateCommandHightlight);

input.addEventListener("scroll", () => {
	commandInterfaceContainer.scrollLeft = input.scrollLeft;
}, { passive: true });

function submitCommand() {
	const command = input.value;
	const span = document.createElement("span")
	span.textContent = "\n" + (command || " ");
	textContent.appendChild(span);
	input.value = "";
	updateCommandHightlight()
	window.scrollBy(0, document.body.scrollHeight);
}

input.addEventListener("beforeinput", removeAutocompliteText)
function removeAutocompliteText() {
	const text = commandHighlight.querySelector(".left")?.textContent?.length || 0;
	const auto = commandHighlight.querySelector(".autocorrect")?.textContent?.length || 0;
	const start = input.value.substring(0, text);
	const end = input.value.substring(text + auto);

	const caretStart = input.selectionStart || 0;
	const caretEnd = input.selectionEnd || 0;

	input.value = start + end;

	console.log("before", input.value + "#")

	input.selectionStart = caretStart;
	input.selectionEnd = caretEnd;
}

function updateCommandHightlight() {
	updateIntellisense();
	commandHighlight.textContent = "";
	const caretLeftText = input.value.substring(0, input.selectionStart || 0);
	const caretRightText = input.value.substring(input.selectionStart || 0);
	const caretLeft = document.createElement("span");
	caretLeft.classList.add("left");
	caretLeft.textContent = caretLeftText;
	const caretRight = document.createElement("span");
	caretRight.textContent = caretRightText;

	const inteliValue = intelisense.options[intelisense.index]?.value
	const autocorrentText = inteliValue?.replace(caretLeftText.split(" ").at(-1), "") ?? "";
	const autocorrent = document.createElement("span");
	autocorrent.textContent = autocorrentText;
	autocorrent.classList.add("autocorrect");
	commandHighlight.append(caretLeft, autocorrent, caretRight);

	const caretStart = input.selectionStart || 0;
	const caretEnd = input.selectionEnd || 0;
	// console.log("after", "#" + " ".repeat(autocorrentText.length) + "#")
	if (input.value.length > 0 && caretRightText.length > 0) input.value = caretLeftText + " ".repeat(autocorrentText.length) + caretRightText;
	input.selectionStart = caretStart;
	input.selectionEnd = caretEnd;
	console.log("after", input.value + "#")
	console.log("after", caretLeftText)
	console.log("after", caretRightText)
}



window.requestAnimationFrame(updateCaret);


console.log("Hello, world!");