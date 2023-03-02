
window.addEventListener("click", e => {
  const audioContext = new (window.AudioContext || window.webkitAudioContext)();



  const loadAudio = (url) => {
    return fetch(url)
      .then(response => response.arrayBuffer())
      .then(arrayBuffer => audioContext.decodeAudioData(arrayBuffer))
      .then(audioBuffer => audioBuffer);
  };
  loadAudio("./audio/eka.mp4").then(audioBuffer => {
    const source = audioContext.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(audioContext.destination);

    const options = {
      source,
      voice_stop: () => {
        const elem = document.querySelector("#output");
        elem.textContent = "speech stopped";
        elem.classList.add("not-speaking")
        elem.classList.remove("speech")
      },
      voice_start: () => {
        const elem = document.querySelector("#output");
        elem.textContent = "speech detected";
        elem.classList.add("speech")
        elem.classList.remove("not-speaking")
      }
    };

    new VAD(options);

    source.start();
  });
})

