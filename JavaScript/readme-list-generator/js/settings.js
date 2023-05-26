const ignoreFoldersValue = localStorage.getItem("showDirectoryPickerIgnore") || ".git\nnode_modules\ndist\nbuild";
const collapseFoldersValue = localStorage.getItem("showDirectoryPickercollapse") || "";
const codeValue = localStorage.getItem("showDirectoryPickerCode") || "https://github.com/<user_name>/<repository>/tree/master";
const demoValue = localStorage.getItem("showDirectoryPickerDemo") || "https://<user_name>.github.io/<repository>/";

const ignoreElement = document.querySelector("#ignore");
ignoreElement.value = ignoreFoldersValue;
let ignoreFolders = ignoreFoldersValue.split("\n");
ignoreElement.addEventListener("input", () => {
	localStorage.setItem("showDirectoryPickerIgnore", ignoreElement.value);
	ignoreFolders = ignoreElement.value.split("\n");
});

const collapseElement = document.querySelector("#collapse");
collapseElement.value = collapseFoldersValue;
let collapseFolders = collapseFoldersValue.split("\n");
collapseElement.addEventListener("input", () => {
	localStorage.setItem("showDirectoryPickercollapse", collapseElement.value);
	collapseFolders = collapseElement.value.split("\n");
});

const codeElement = document.querySelector("#code");
codeElement.value = codeValue;
let codeTemplate = codeValue;
codeElement.addEventListener("input", () => {
	localStorage.setItem("showDirectoryPickerCode", codeElement.value);

	if (codeElement.value.endsWith("/")) {
		codeElement.value = codeElement.value.slice(0, -1);
	} else codeTemplate = codeElement.value;
});

const demoElement = document.querySelector("#demo");
demoElement.value = demoValue;
let demoTemplate = demoValue;
demoElement.addEventListener("input", () => {
	localStorage.setItem("showDirectoryPickerDemo", demoElement.value);

	if (demoElement.value.endsWith("/")) {
		demoElement.value = demoElement.value.slice(0, -1);
	} else demoTemplate = demoElement.value;
});

const resetElement = document.querySelector("#reset");
resetElement.addEventListener("click", () => {
	localStorage.removeItem("showDirectoryPickerIgnore");
	localStorage.removeItem("showDirectoryPickercollapse");
	localStorage.removeItem("showDirectoryPickerCode");
	localStorage.removeItem("showDirectoryPickerDemo");
	location.reload();
});