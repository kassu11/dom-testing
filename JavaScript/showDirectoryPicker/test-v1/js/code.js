document.querySelector("button#open").addEventListener("click", async () => {
	const handle = await showDirectoryPicker({ mode: "read" });
	const parent = document.querySelector("pre");
	const elems = createPWithText([
		[0, `<ul>`],
		[0, "<marker>"],
		[0, `</ul>`],
	]);
	parent.append(...elems);
	recursiveDirectorySearch(handle, undefined, 0, elems[1]);
});

async function recursiveDirectorySearch(folderHandler, path = "", depth = 0, elem = null) {
	const contentArray = [];
	let nextElementParent = elem;
	for await (const entry of folderHandler.values()) {
		contentArray.push(entry);
	}


	const hasIndexHtml = contentArray.some((entry) => entry.name === "index.html");
	const folders = contentArray.filter((entry) => entry.kind === "directory" && validateFolder(entry.name));

	if (hasIndexHtml) {
		const elements = createProjectBlock(folderHandler.name, path, depth);
		nextElementParent.after(...elements);
		nextElementParent.remove();
	} else {
		if (folders.length > 1 && depth > 0) {
			const elements = createSummaryElement(folderHandler.name, path, depth);
			depth += 2;
			nextElementParent.after(...elements);
			nextElementParent.remove();
			nextElementParent = elements.find((elem) => elem.textContent.startsWith("<marker>"));
		} else if (folders.length === 1) {
			const [folder] = folders;
			recursiveDirectorySearch(folder, path + "/" + folder.name, depth, nextElementParent);
			return;
		}
		for (const folder of folders) {
			const [startMarker, endMarker] = createLiContainer();
			nextElementParent.after(startMarker, endMarker);
			nextElementParent.remove();
			recursiveDirectorySearch(folder, path + "/" + folder.name, depth + 1, startMarker);
			nextElementParent = endMarker;
		}
		nextElementParent.remove(); // Removes last endMarker
	}
}

function validateFolder(name) {
	if (name === ".git") return false;
	if (name === "node_modules") return false;
	if (name === "dist") return false;
	if (name === "build") return false;
	return true;
}

function createLiContainer() {
	const elements = createPWithText([
		[0, `<startMarker>`],
		[0, "<endMarker>"],
	]);

	return elements;
}

function createSummaryElement(name, path, depth) {
	const elements = createPWithText([
		[depth, `<li>`],
		[depth + 1, `<details open><summary><a href="https://github.com/kassu11/dom-testing/tree/main${path}">📂</a> ${name}</summary>`],
		[depth + 2, `<ul>`],
		[0, "<marker>"],
		[depth + 2, `</ul>`],
		[depth + 1, `</details>`],
		[depth, `</li>`],
	]);

	return elements;
}

function createProjectBlock(name, path, depth) {
	const elements = createPWithText([
		[depth, `<li>${name}`],
		[depth + 1, `<blockquote>`],
		[depth + 2, `Links: <a href="https://github.com/kassu11/dom-testing/tree/main${path}">Code</a> & <a href="https://kassu11.github.io/dom-testing/${path}">Demo</a>`],
		[depth + 1, `</blockquote>`],
		[depth, `</li>`],
	]);

	return elements;
}

function createPWithText(texts) {
	return texts.map(([indentation, text]) => {
		const p = document.createElement("span");
		p.textContent = `${"\t".repeat(indentation)}${text}\n`;
		return p;
	});
}
