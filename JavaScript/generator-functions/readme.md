# Generator function testing

- Here are some random `generator` function tests that I have done
- This is the first time I have ever used the `generator` function, so I tried to find useful ways to use them
	- They are super **convenient inside loops**
	- You can create a **Python** range function with `8 lines of code` and even exit forEach loop
		- The only other way to exit forEach loop is to `throw` and `catch` an error, but this seems more useful
		- You can also use `generators` inside `reduce` functions, so you can get an early return value :O
		- Here is a code snippet, because the file is over `200 lines long` :D
```js
function* g8(array) {
	const iterable2 = {
		[Symbol.iterator]() {
			let i = -1;
			return {
				next() {
					return { value: array[++i], done: i === array.length };
				},
				return(value) {
					return { value, done: true };
				}
			}
		}
	}

	yield* iterable2
}

const gen8 = g8([1, 2, 3, 4, "stop", 5, 6, 7]);

// 1, 2, 3, 4
// This will stop the loop execution when the return is called
const gen8LoopValue = gen8.reduce((acc, value, i, arr) => {
	console.log(acc, value, i, arr); // Array is undefines :c
	if(value == "stop") return gen8.return(acc).value
	return acc + value;
});

console.log(gen8LoopValue)
```

- There are also some tests with `Symbol.iterators` because they are very similar to generators