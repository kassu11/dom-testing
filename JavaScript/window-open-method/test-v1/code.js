document.querySelector("button").addEventListener("click", e => {
	const site = window.open("", "mywindow1", "status=1,width=350,height=150");
	const div = document.createElement("div");
	div.innerHTML = "Hello World!";

	site.document.body.append(div)
});
