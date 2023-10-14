# New window multithreading testing

- I was testing if a new window would make a separate thread for the JavaScript code
- The pop-up runs an infinite loop, that also will crash the main thread
	- This means that both windows use the same main thread, so you can't just make a new window to easily multithread and have to use web workers