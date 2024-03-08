# Consistent Perlin noise

- The `last versions` were very Perlin noise-looking, but if you wanted to use them in world generation they would not work, because the results are always random
- This will always generate the same noise from the seed and the same coordinates
	- If the coordinates change a little the noise will just move the `delta amount` rather than generating totally new noise
	- This noise should always connect to each other seamlessly
