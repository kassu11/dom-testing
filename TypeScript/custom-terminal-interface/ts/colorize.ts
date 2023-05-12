function colorHighlight() {
	const text = commandHighlight.querySelector(".left")?.textContent + "" + commandHighlight.querySelector(".right")?.textContent;
	const path = traceCommandPath(text.split(" "));
	path.forEach((pathItem, index) => {
		const spans = commandHighlight.querySelectorAll(`span[data-index="${index}"]`) as NodeListOf<HTMLSpanElement>

		spans.forEach((element: HTMLSpanElement) => {
			if (!pathItem) element.style.color = "#f87171";
			else element.style.color = pathItem?.color || "";
		})
	});
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
	const intelliValue = intellisense.options[intellisense.index]?.value ?? "";
	const autocorrentText = intelliValue.startsWith(currentCommand) && tooltip.textContent ? intelliValue.replace(currentCommand, "") : "";
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

input.addEventListener("input", () => updateCommandHightlight());