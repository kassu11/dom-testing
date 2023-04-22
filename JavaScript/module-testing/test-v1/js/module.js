export default function test() {
	console.log("Printing from module.js")
}

export const array = [1, 2, 3, 4, 5];
export const obj = { a: 1, b: 2, c: 3 };


const item = {
	id: 1,
	name: "Item 1",
	price: 100,
	quantity: 1,
	total: 100
}

export { item as sword };