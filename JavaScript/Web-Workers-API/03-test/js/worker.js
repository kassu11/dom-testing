onmessage = event => {
  event.data.sort((a, b) => a - b);
  postMessage(event.data);
}