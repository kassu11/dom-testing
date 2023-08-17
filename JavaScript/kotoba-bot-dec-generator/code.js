const searchElem = document.querySelector("#url");
const startPageElem = document.querySelector("#startPage");
const endPageElem = document.querySelector("#endPage");

const statusElem = document.querySelector("#status");
const stopElem = document.querySelector("#stop");

const startButton = document.querySelector("#start");
const processedElem = document.querySelector("#processed");

const jsonButton = document.querySelector("#json");
const jsonFormatButton = document.querySelector("#jsonFormat");
const csvButton = document.querySelector("#csv");
const downloadElem = document.querySelector("#download");

const errorDialogElem = document.querySelector("#error");
const errorMessageElem = errorDialogElem.querySelector("#errorMessage");

const deck = {
	"name": "",
	"description": "Custom deck created for Kotoba Bot.",
	"cards": []
};

startButton.addEventListener("click", async () => {
	if (searchElem.value === "") return error("Please enter a search term.");
	startButton.disabled = true;
	stopElem.disabled = false;
	deck.name = searchElem.value;
	const url = encodeURIComponent(searchElem.value);
	let startPage = Math.abs(parseInt(startPageElem.value)) || 1;
	let endPage = Math.abs(parseInt(endPageElem.value)) || 0;

	let processed = 0;
	processedElem.textContent = processed;
	statusElem.textContent = "Searching...";
	deck.cards = [];

	const interval = setInterval(async () => {
		const json = await search(url, startPage);
		if (json.length === 0) return stopSearch(interval);


		processed++;
		processedElem.textContent = processed;
		statusElem.textContent = "Processing...";
		jsonButton.disabled = false;
		jsonFormatButton.disabled = false;
		csvButton.disabled = false;


		for (const entry of json) {
			const card = {
				"question": entry.japanese[0].word ?? entry.slug,
				"answer": [],
				"meaning": ""
			};

			entry.japanese.forEach(row => {
				if (!row.reading) return;
				if (!row.word) card.answer.push(row.reading);
				else if (row.word === card.question) card.answer.push(row.reading);
			});
			entry.senses.forEach(row => {
				if (!row.english_definitions) return;
				if (card.meaning.length) card.meaning += ", " + row.english_definitions.join(", ");
				else card.meaning = row.english_definitions.join(", ");
			});

			deck.cards.push(card);
		}

		if (++startPage >= endPage && endPage !== 0) {
			stopSearch(interval);
			return;
		}
	}, 500);
});


jsonButton.addEventListener("click", () => {
	const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(deck));
	downloadElem.setAttribute("href", dataStr);
	downloadElem.setAttribute("download", "deck.json");
	downloadElem.click();
});

jsonFormatButton.addEventListener("click", () => {
	const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(deck, null, 2));
	downloadElem.setAttribute("href", dataStr);
	downloadElem.setAttribute("download", "deck.json");
	downloadElem.click();
});

csvButton.addEventListener("click", () => {
	const array = deck.cards.map(card => {
		return `${card.question},${csvValue(card.answer.join(","))},${csvValue(card.meaning)},Type the reading!,Image`;
	});
	const dataStr = "data:text/txt;charset=utf-8," + "Question,Answers,Comment,Instructions,Render as\n" + encodeURIComponent(array.join("\n"));
	downloadElem.setAttribute("href", dataStr);
	downloadElem.setAttribute("download", "deck.csv");
	downloadElem.click();
});

function csvValue(value) {
	if (value === null || value === undefined) return "";
	if (value?.includes(",")) return `"${value}"`;
	return value;
}

function stopSearch(interval) {
	clearInterval(interval);
	startButton.disabled = false;
	statusElem.textContent = "Done";
	stopElem.disabled = true;
}

searchElem.value = "#jlpt-n5";
startPage.value = 20;

async function search(url, page) {
	try {
		const response = await fetch(`https://cors-anywhere.herokuapp.com/https://jisho.org/api/v1/search/words?keyword=${url}&page=${page}`, {
			mode: "cors"
		});
		const json = await response.json();
		return json.data;
	}
	catch (e) {
		console.error(e);
		error("An error occurred while searching.")
		return [];
	}
}


function error(message) {
	errorDialogElem.showModal();
	errorMessageElem.textContent = message;
	startButton.disabled = false;
}