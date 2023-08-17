const searchElem = document.querySelector("#url");
const startPageElem = document.querySelector("#startPage");
const endPageElem = document.querySelector("#endPage");

const statusElem = document.querySelector("#status");
const stopElem = document.querySelector("#stop");

const startButton = document.querySelector("#start");
const processedElem = document.querySelector("#processed");

const jsonButton = document.querySelector("#json");
const csvButton = document.querySelector("#csv");

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

		for (const entry of json) {
			const card = {
				"question": entry.slug,
				"answer": [],
				"meaning": ""
			};

			entry.japanese.forEach(row => {
				if (row.word === entry.slug) card.answer.push(row.reading);
			});
			entry.senses.forEach(row => {
				if (!row.english_definitions) return;
				if (card.meaning.length) card.meaning += ", " + row.english_definitions.join(", ");
				else card.meaning = row.english_definitions.join(", ");
			});

			deck.cards.push(card);
		}



		if (true || ++startPage >= endPage && endPage !== 0) {
			stopSearch(interval);
			return;
		}
	}, 500);
});


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