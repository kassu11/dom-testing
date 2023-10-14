document.querySelector("button").addEventListener("click", (e) => {
	window.open("./popup.html", "mywindow1", "status=1,width=350,height=150,top=200");
});

setInterval(() => {
	timer.textContent = ++timer.textContent;
}, 100);
