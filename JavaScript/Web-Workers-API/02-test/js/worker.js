function timedCount() {
  console.log("Start")
  for(let i = 0; i < 100; i++) {
    const random = Array(1000000).fill(0).map(() => Math.random());
  }
  postMessage([1, 2, 3]);
}

timedCount();