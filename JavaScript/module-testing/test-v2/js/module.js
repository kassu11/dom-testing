console.log("Loading module.js");
await new Promise(resolve => setTimeout(resolve, 1000));
document.body.style.backgroundColor = "red";

function test() {
	console.log("test() called");
}

export function test2() {
	console.log("test2() called");
}

console.log("This delays the execution of the module code by 1 second")
await new Promise(resolve => setTimeout(resolve, 1000));

export default test;