export default function card() {
	const div = document.createElement("div");
	div.classList.add("card");
	div.innerHTML = `
		<h1>Card</h1>
		<button>Change color</button>
	`;
	return div;
}

export function changeColor() {
	const rgb = [...Array(3)].map(() => Math.round(Math.random() * 255));
	document.body.style.backgroundColor = `rgb(${rgb.join(",")})`;
}