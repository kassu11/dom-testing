const obj = {
	"settings": {
		"list": {
			"item": [
				{
					"name": "item1",
					"enabled": true
				},
				{
					"name": "item2",
					"enabled": false
				}
			]
		}
	}
}

const handler = (parent) => ({
	get: (target, prop, recever) => {
		if (prop === "parent") return parent;
		if (typeof target[prop] === "object" && target[prop] !== null) {
			return new Proxy(target[prop], handler(recever));
		}

		return target[prop];
	}
})

const proxy = new Proxy(obj, handler());

console.log(proxy.settings.list.item[0].enabled) // true
console.log(proxy.settings.list.item[0].parent) // {0: {…}, 1: {…}}
console.log(proxy.settings.list.item[0].parent.parent) // {item: Array(2)}
console.log(proxy.settings.list.item[0].parent.parent.parent) // {list: {…}}
console.log(proxy.settings.parent.settings.list) // {item: Array(2)}
console.log(proxy.parent) // undefined
console.log(proxy.settings.parent) // {settings: {…}}
console.log(proxy.settings.parent.parent) // undefined