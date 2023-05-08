document.querySelector("p").innerText = "double  space";
if (document.querySelector("p").innerText === "double  space") {
	console.log("innerText works")
} else {
	console.log("innerText doesn't work")
}

document.querySelector("p").textContent = "double  space";
if (document.querySelector("p").textContent === "double  space") {
	console.log("textContent works")
} else {
	console.log("textContent doesn't work")
}
