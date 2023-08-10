# Web Workers reduce lag

- This is the first practical demo, where the main thread would be blocked if you didn't use web worker
- I simulated just a laggy process on the web worker and if that same process was done in the main thread, all other actions on the page would have stopped, like scrolling, clicking, etc.
- The data is just for show, and it's never even sent back :D