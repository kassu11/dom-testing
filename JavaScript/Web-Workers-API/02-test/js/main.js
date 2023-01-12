let worker;
let interval;

function startWorker() {
  if(typeof Worker !== "undefined") {
    if(typeof worker === "undefined") {
      worker = new Worker("./js/worker.js");
      let i = 0;
      interval = setInterval(() => {
        document.querySelector("#timer").textContent = i++;
      }, 1);
    }

    worker.onmessage = event => {
      console.log(event.data);
      clearInterval(interval);
      interval = null;
      document.querySelector("#result").textContent = event.data;
      worker.terminate();
      worker = undefined;
    };
  } else {
    document.querySelector("p").textContent = "Sorry, your browser does not support Web Workers...";
  }
}