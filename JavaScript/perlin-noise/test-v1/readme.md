# My kubic Perlin noise

- First, the code fills the canvas with solid blocs that have random brightness values
- Then the canvas is copied and a Gaussian blur is added
	- This is probably an insult to the real Perlin noise, but it kinda looks the same
- The random function used returns values between -1 and 1
	- Every negative color value is black, so this makes the noise most likely to pick a dark value
	- This is not a mistake


