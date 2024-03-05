# Rectangle noise stacking

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
