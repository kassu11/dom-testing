const openFolderButton = document.querySelector("button#open");
const generateButton = document.querySelector("button#generate");

openFolderButton.addEventListener("click", async () => {
	const handler = await showDirectoryPicker({ mode: "read" });
	generateButton.onclick = () => startGeneration(handler);
	generateButton.disabled = false;
	startGeneration(handler);
});

async function startGeneration(handler) {
	const container = document.querySelector("pre");
	container.textContent = "";
	const mainWrapper = createTextElements([
		[0, `<ul>`],
		[0, "<marker>"],
		[0, `</ul>`],
	]);
	container.append(...mainWrapper);
	const marker = mainWrapper.find((elem) => elem.textContent.startsWith("<marker>"));
	recursiveDirectorySearch(handler, "", 0, marker);
}

async function recursiveDirectorySearch(folderHandler, path = "", depth = 0, currentMarker, name = "") {
	const contentArray = [];
	for await (const entry of folderHandler.values()) contentArray.push(entry);

	const hasWebPage = contentArray.some((entry) => entry.name === "index.html");
	const folders = contentArray.filter((entry) => entry.kind === "directory" && validateFolder(entry.name));

	if (hasWebPage) {
		const elements = createProjectBlock(name, path, depth);
		elementsToMarker(elements, currentMarker);
	} else {
		if (folders.length > 1 && depth > 0) {
			const elements = createSummaryElement(folderHandler.name, path, depth);
			depth += 2;
			elementsToMarker(elements, currentMarker);
			currentMarker = elements.find((elem) => elem.textContent.startsWith("<marker>"));
		} else if (folders.length === 1) {
			const [folder] = folders;
			recursiveDirectorySearch(folder, path + "/" + folder.name, depth, currentMarker, folderHandler.name);
			return;
		}
		for (const folder of folders) {
			const [startMarker, endMarker] = createContainerMarkers();
			elementsToMarker([startMarker, endMarker], currentMarker)
			recursiveDirectorySearch(folder, path + "/" + folder.name, depth + 1, startMarker, folder.name);
			currentMarker = endMarker;
		}
		currentMarker.remove(); // Removes last endMarker
	}
}

function elementsToMarker(elements, marker) {
	marker.after(...elements);
	marker.remove();
}

function validateFolder(name) {
	return ignoreFolders.every((folder) => folder !== name);
}

function createContainerMarkers() {
	return createTextElements([
		[0, `<startMarker>`],
		[0, "<endMarker>"],
	]);
}

function createSummaryElement(name, path, depth) {
	return createTextElements([
		[depth, `<li>`],
		[depth + 1, `<details open><summary><a href="${codeTemplate}${path}">📂</a> ${name}</summary>`],
		[depth + 2, `<ul>`],
		[0, "<marker>"],
		[depth + 2, `</ul>`],
		[depth + 1, `</details>`],
		[depth, `</li>`],
	]);
}

function createProjectBlock(name, path, depth) {
	return createTextElements([
		[depth, `<li>${name}`],
		[depth + 1, `<blockquote>`],
		[depth + 2, `Links: <a href="${codeTemplate}${path}">Code</a> & <a href="${demoTemplate}${path}/">Demo</a>`],
		[depth + 1, `</blockquote>`],
		[depth, `</li>`],
	]);
}

function createTextElements(texts) {
	return texts.map(([indentation, text]) => {
		const span = document.createElement("span");
		span.textContent = "\t".repeat(indentation) + text + "\n";
		return span;
	});
}
