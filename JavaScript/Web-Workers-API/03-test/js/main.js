let worker;
const array = [9, 8, 7, 6, 5, 3, 1, 2, 12, 23, 32, 45, 56, 76, 87, 897, 56, 34, 12];

function startWorker() {
  if (typeof Worker !== "undefined") {
    if (typeof worker === "undefined") {
      worker = new Worker("./js/worker.js");
      worker.postMessage(array);
    }

    worker.onmessage = event => {
      document.querySelector("#result").textContent = JSON.stringify(event.data).replaceAll(",", ", ") + "\n";
      document.querySelector("#result").textContent += JSON.stringify(array).replaceAll(",", ", ");
      document.querySelector("#result").textContent += "\nWeb worker copies the array and sorts it :/"
      worker.terminate();

      worker = undefined;
    };
  } else {
    document.querySelector("p").textContent = "Sorry, your browser does not support Web Workers...";
  }
}