# Fill the space with the least amount of tiles

- This problem probably has a nice and cool name but I will just call it `min-max fill`
	- Use the `minimum amount of tiles` with `maximum tile sizes` to `fill a space`
- I was playing with `3D CSS perspective` and noticed that if your 3D world has over `500 tiles it starts to lag`
- The easiest way of fixing this is to make the tiles bigger and use `background repeat to fill the whole tile`
	- In a `Minecraft` style game engine this will `drastically remove the number of tiles needed`
- So yeah this project is just to test different algorithms to use

## Version 1

- This was my first attempt at making a `min-max fill algorithm`
- Basically, this algorithm just tries to `calculate possible starting positions`
	- These `positions are` marked as `red cubes` on the map
	- The positions are basically just `wall corners`
	- Then from these points, it just `fills the space` from `left` to `right`, `top` to `bottom`
- This algorithm `doesn't have any merging logic` it just fills
	- Because of this it `can leave empty spaces behind` which is really bad
	- The empty spaces happen about `10%` of the time, but because of them `I can't use this algorithm`
	- This also `doesn't find the optimal min-max solution`, so this is bad

## Version 2

- This algorithm `doesn't leave behind empty spaces` so it is better than `version 1`
- It sometimes gets more tiles than `version 1`, with is bad
- The algorithm brute forces its way to a solution and starts by filling every empty space with a `1x1` tile
	- Then it will `start merging these tiles together` if that is possible
	- Then it just tries to do this for a length of time and that is the solution
	- The code is also super ugly so I'm not that happy about this
- I think this one `has promise`, but I will have to add more merging patterns and also add some weight to them
- Now the `algorithm prefers to merge just by direction`, which is `not ideal`
- Sometimes it might also take multiple merges to find the best solution, and this will not find that

