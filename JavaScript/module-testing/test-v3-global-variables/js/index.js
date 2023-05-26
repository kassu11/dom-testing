import hello from "./module.js";

const player = {
	name: "Player 1",
	health: 100,
	alive: true
}

console.log(self.player);
console.log(globalThis.player);
console.log(document.player);
console.log(window.player);
console.log(player);

hello();

Object.defineProperty(globalThis, "player", {
	get() { return player },
	set(value) { player = value }
});

Object.defineProperty(globalThis, "hello", {
	get() { return hello },
	set(value) { hello = value }
});

setInterval(() => {
	document.querySelector("pre").textContent = JSON.stringify(player, null, 2);
}, 100);