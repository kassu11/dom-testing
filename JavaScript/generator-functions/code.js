function * gen0() {
	yield 1;
	yield 2;
	yield 3;
	yield 4;
	return 5;
}

for(const value of gen0()) {
	console.log(value); // 1 2 3 4
}

const v = gen0();
console.log(v); // gen0 {<suspended>}
v.next() // {value: 1, done: false}
v.next() // {value: 2, done: false}
v.next() // {value: 3, done: false}
const lastYield = v.next() // {value: 4, done: false}
const returnValue = v.next() // {value: 5, done: true}
console.log(lastYield, returnValue); // {value: 4, done: false}, {value: 5, done: true}

// 1 2 3 4
gen0().forEach(v => console.log("ForEach:", v * 2));




function* g4() {
  yield* [1, 2, 3];
  return "foo";
}

function* g5() {
  const g4ReturnValue = yield* g4();
  console.log(g4ReturnValue); // 'foo'
  return g4ReturnValue;
}

const gen5 = g5();

console.log(gen5.next()); // {value: 1, done: false}
console.log(gen5.next()); // {value: 2, done: false}
console.log(gen5.next()); // {value: 3, done: false} done is false because g5 generator isn't finished, only g4
console.log(gen5.next()); // {value: 'foo', done: true}









const iterable = {
	[Symbol.iterator]() {
		let count = 0;
		return {
			next(v) {
				console.log("next called with", v);
				count++;
				return { value: count, done: false };
			},
			return(v) {
				console.log("return called with", v);
				if (v == "stop") return { value: "Stopping iterating", done: true };
				return { value: "iterable return value", done: false };
			},
			throw(v) {
				console.log("throw called with", v);
				return { value: "iterable thrown value", done: true };
			},
		};
	},
};

function* gf() {
	yield* iterable;
	return "gf return value";
}

const gen6 = gf();
console.log(gen6.next(10));
// next called with undefined; the argument of the first next() call is always ignored
// { value: 1, done: false }
console.log(gen6.next(20));
// next called with 20
// { value: 2, done: false }
console.log(gen6.return(30));
// return called with 30
// { value: 'iterable return value', done: false }
console.log(gen6.next(40));
// next called with 40
// { value: 3, done: false }
console.log(gen6.return("stop"));
// return called with stop
// { value: 'Stopping iterating', done: true }
console.log(gen6.next(40));
// { value: undefined, done: true }; gen is already closed

const gen7 = gf();
console.log(gen7.next(10));
// next called with undefined
// { value: 1, done: false }
console.log(gen7.throw(50));
// throw called with 50
// { value: 'gf return value', done: true }
console.log(gen7.next(60));
// { value: undefined, done: true }; gen is already closed







function * g6(array) {
	for(let i = 0; i < array.length; i++) {
		yield array[i];
	}
}

const iteratorArray = [1, 2, 3, 4, 5][Symbol.iterator]();
const yieldArray = function *() {yield* [1, 2, 3, 4, 5]}()
const yieldArray2 = g6([1, 2, 3, 4, 5])

for(const v of iteratorArray) {
	console.log("Iterator loop1", v) // 1 2 3
	if(v == 3) break;
}
for(const v of iteratorArray) {
	console.log("Iterator loop2", v) // 4 5
}


for(const v of yieldArray) {
	console.log("Yield loop1", v) // 1 2 3
	if(v == 3) break;
}
for(const v of yieldArray) {
	 // This will nevel log, because the break will close the generator
	console.log("Yield loop2", v)
}


for(const v of yieldArray2) {
	console.log("Yield2 loop1", v) // 1 2 3
	if(v == 3) break;
}
for(const v of yieldArray2) {
	 // This will nevel log, because the break will close the generator
	console.log("Yield2 loop2", v)
}









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










function* infiniteLoop(array) {
	while (true) yield* array;
}

let result = "";
for(const value of infiniteLoop(["L", "o"])) {
	result += value;
	if (result.length == 25) break;
}
console.log(result);








function* range(a = 0, b, step = b < a ? -1 : 1) {
	if (b == null) [a, b] = [0, a];
	if (step === 0 || step < 0 === (a - b) < 0) throw("Infinite loop")
		if (a < b) {
			for (; a < b; a += step) yield a;
		} else {
			for (; a > b; a += step) yield a;
		}
}


for(const v of range(0, 50, 2)) {
	console.log("testing:", v);
}