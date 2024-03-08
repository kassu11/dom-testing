# Perlin noise

- Here are my Perlin noise testing
- The real math just seemed kinda hard so I made my own Perlin noise logic
	- I might look at an actual Perlin noise some day tho

## Test 1 | My kubic Perlin noise

- First, the code fills the canvas with solid blocs that have random brightness values
- Then the canvas is copied and a Gaussian blur is added
	- This is probably an insult to the real Perlin noise, but it kinda looks the same
- The random function used returns values between -1 and 1
	- Every negative color value is black, so this makes the noise most likely to pick a dark value
	- This is not a mistake

## Test 2 | Ellipse Perlin noise

- This is a continuation of the previous code
- The rectangles are changed to ellipses and the size and position also change a little
- I thought this might make a huge difference, but the output is very similar

## Test 3 | Ellipse Perlin noise 2

- Added a random noise on top of the previous demo
- This makes the code a lot slower but makes the transition a bit less smooth
- This change also doesn't make a huge difference, so the `test-v1` demo is probably the best
	- It is definitely the fastest and simplest to understand

## Test 4 | Rectangle noise stacking

- Basically the same demo as `version 1`, but there are 4 different layers that are stacked on top of each other
	- The layers will get `smaller and smaller` and then combine their color values together
	- The function contains lots of random numbers, that I have just tested and tweaked to get the best result
		- There is not really any logic to them, and you can tweak the values for a better result
	- One surprise that I discovered was that my `pseudo-random` function favors `higher numbers`, so most numbers `are > 0.5`
		- This actually will affect the noise generated massively, and the reason that this generator works this well is because the `numbers are mostly above 0.5`
		- Then I switched the pseudo-random generator to use the more evenly distributed `splitmix32` function, the results did not look this good

| Even random number distibution              | Uneven number distribution                  |
|---------------------------------------------|---------------------------------------------|
| <img src="https://i.imgur.com/dbFfoxU.png"> | <img src="https://i.imgur.com/QUcdIyx.png"> |


## Test 5 | Consistent Perlin noise

- The `last versions` were very Perlin noise-looking, but if you wanted to use them in world generation they would not work, because the results are always random
- This will always generate the same noise from the seed and the same coordinates
	- If the coordinates change a little the noise will just move the `delta amount` rather than generating totally new noise
	- This noise should always connect to each other seamlessly
