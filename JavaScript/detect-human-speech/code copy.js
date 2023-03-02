
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
  
    const analyser = audioContext.createAnalyser();
    source.connect(analyser);
    analyser.fftSize = 2048;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
  
    let prevMax = 0;
    let speaking = false;
    let startTime;
    source.start();
    for (let i = 0; i < audioBuffer.duration; i += 0.05) {
      analyser.getByteFrequencyData(dataArray);
      const max = dataArray.reduce((a, b) => Math.max(a, b));
      if (!speaking && max > prevMax) {
        console.log("Start of speech segment:", i);
        speaking = true;
        startTime = i;
      } else if (speaking && max < prevMax) {
        console.log("End of speech segment:", i);
        console.log("Duration of speech segment:", i - startTime);
        speaking = false;
      }
      prevMax = max;
    }
  });
})

