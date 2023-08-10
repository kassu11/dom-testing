# Sending data to Web Workers 

- All the demos thus far have only received data from the worker, but this time we want to send data to the worker
- The array of data is then sorted and sent back to the main thread
- The web worker copied the array, which is bad because that will cause extra lag if you are sending a lot of data though
	- I don't know if it is possible to disable this data coping, but I had to guess it's not possible to disable it