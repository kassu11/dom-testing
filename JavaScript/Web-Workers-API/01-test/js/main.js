let worker;

function startWorker() {
  if(typeof Worker !== "undefined") {
    if(typeof worker === "undefined") {
      worker = new Worker("./js/worker.js");
    }
    worker.onmessage = event => {
      console.log(event.data)
      document.getElementById("result").textContent = event.data;
    };
  } else {
    document.getElementById("result").textContent = "Sorry, your browser does not support Web Workers...";
  }
}

function stopWorker() { 
  worker.terminate();
  worker = undefined;
}