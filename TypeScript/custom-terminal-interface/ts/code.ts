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

function updateCommandHightlight() {
	commandHighlight.textContent = "";
	const caretLeftText = input.value.substring(0, input.selectionStart || 0);
	const caretRightText = input.value.substring(input.selectionStart || 0);
	const caretLeft = document.createElement("span");
	caretLeft.textContent = caretLeftText;
	const caretRight = document.createElement("span");
	caretRight.textContent = caretRightText.substring(caretRightText.indexOf(" ") + 1);

	const inteliValue = intelisense.options[intelisense.index]?.value
	const autocorrentText = inteliValue?.replace(caretLeftText.split(" ").at(-1), "") ?? "";
	const autocorrent = document.createElement("span");
	autocorrent.textContent = autocorrentText;
	autocorrent.classList.add("autocorrect");
	commandHighlight.append(caretLeft, autocorrent, caretRight);
	// const s = input.selectionStart || 0
	// const e = input.selectionEnd || 0
	// console.log(commandHighlight.textContent.length)
	// if (input.value.length > 0) input.value = input.value.padEnd(commandHighlight.textContent.length - 1, " ");
	// input.selectionStart = s
	// input.selectionEnd = e
}



window.requestAnimationFrame(updateCaret);


console.log("Hello, world!");