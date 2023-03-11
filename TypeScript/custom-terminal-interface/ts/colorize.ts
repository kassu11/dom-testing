function colorHighlight() {
	const text = commandHighlight.querySelector(".left")?.textContent + "" + commandHighlight.querySelector(".right")?.textContent;
	console.log(intellisense.command)
	text.split(" ").forEach((word, index) => {
		const spans = commandHighlight.querySelectorAll(`span[data-index="${index}"]`) as NodeListOf<HTMLSpanElement>
		const error = filterData([intellisense.command], word, index, true).length === 0;

		spans.forEach((element: HTMLSpanElement) => {
			if (error) element.style.color = "#f87171";
			else element.style.color = intellisense.command.commands[index]?.color || "";
		})
	})
}