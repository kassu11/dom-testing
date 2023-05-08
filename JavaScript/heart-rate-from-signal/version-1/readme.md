# Heart rate from signal

- This is a test that is part of my school project.
- We have a heart rate sensor that gives data that can be converted to heart rate.
- This is the first algorithm that I came up with.
- I ran the heart rate sensor on my finger and saved the data to an array.
	- This script draws lines, where the code thinks your heart rate peaks.

## How it works

- Basically, humans have one big peak and then another smaller peak after that.
- The code saves all the peak values to a `buffer array` and then tries to find where a peak is bigger than the peak on its `right` and `left` sides.
	- When the code finds a peak from the `buffer` that meets these criteria it gets the max value and then flags that as the heart rate
- Here is an image that shows what the script tries to flag

<img src="https://i.imgur.com/USTI6Nk.png">

- `Blue` line is the data array, so the heart rate sensor values
- `Red` lines are from this script and mark your heart rate peaks
	- As you can see it is very consistent 👍
