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

## Version 3

- The algorithm starts by filling the whole map with a one big tile
- Then the walls are looped end every time a wall is inside a tile it slits the tile into sections around the wall
	- After the split, we check if there are other tiles around the slips that can be merged together
	- If there are none, then just keep going to the next wall until every wall has been looped
- This is the the easiest algorithm to explain and the code is also only 70 lines
	- This is the fastest algorithm and has the least lines of code so far, but it is not perfect
	- Version 3: [6 Tiles](https://i.imgur.com/zrIjOWu.png)
	- The optimal solution: [5 Tiles](https://i.imgur.com/0jmpZeV.png)
- This algorithm basically always loses to version 2, with is a little sad, but it is a good base because the code is a lot cleaner

## Version 4

- Version 4 tries to fix all the problems from version 3
- Basically, it runs the same algorithm to fill the space as version 3
- After this, it begins to merge these tiles together
	- It picks a tile and then gets all the connected tiles to the selected tile
	- If a 1x1 tile is in contact with a connected tile it will be counted in this group also
	- Then this group is simulated into a new space where the group forms the empty space and everything else is walls
	- After this, the space is filled with tiles horizontally and vertically and compared if the tile count was smaller than the original
	- If the tile count didn't change the selected tile is marked as perfect and the next tile is selected
	- If the tile count has gone down the new simulated tile structure will replace the tiles
- After every tile has been marked perfect the algorithm is done
	- You might think that this will give a perfect solution, but it doesn’t :D
	- This also sometimes gives more tiles than version 2, but this is consistently better
	- This is also about the same speed that version 2 is to compute

## Version 5

- `Version 5` is a modified version of `version 4`
- The start is identical to `version 3` and then the simulation is the same as version 4
	- The `only difference is the simulation size` and the `number of tries before giving up`
	- The simulation group is comprised of tiles that are touching the selected tile
	- Every tile that is in contact with a touching tile and shares the same `y` or `x` value is also part of the group
	- The iterations stop only when there `are no changes in a full grid loop`
		- `Version 4` was optimized to not calculate the same group simulation multiple times, but this sometimes caused the simulation to end too soon, so `version 5` removes this optimation
		- Because of this `version 5` is by far the `slowest algorithm to run`
		- It gets good results, but the speed is so bad that my browser will struggle to generate `100x100` random wall grid
		- This also sometimes loses to `version 2`, but this is not common
- `I dislike this algorithm` probably the most `because the lag` and the simulation code are `a nightmare to debug`
- I will try to make a totally different algorithm next

## Version 6 & 7

- `Version 6` and `7` are very similar and the only `difference is the direction`
- `Version 6` will `start` by filling the tiles `horizontally` and `7` by filling them `vertically`
- Then the perfectly matching `tiles are merged together`
- After this, the tiles `are stretched in the opposite direction we started`
	- This stretching is broken into `2 steps` so `up/down` and `left/right`
		- The stretching is just a check that can a selected tile grow more in the selected direction without making more tiles
			- If this is true, then grow if not then stay
	- So the whole algorithm is just `fill`, `merge` and `stretch`
	- This gives by far the best results, but it's `not perfect`, because `depending on your starting direction` your result may vary
	- Because of this I made horizontal and vertical versions (6 and 7)
- Now in a 100x100 grid versions 6 and 7 give nearly identical results, but sometimes the other is about 5 tiles ahead
	- Of course, these walls are generated with random numbers, so they should be very evenly distributed which is the reason why direction isn't a big factor
	- If the grid was an actual map the directions would have more of a difference and because of this, they are not perfect algorithms yet
	- I don't have an idea to perfect them without losing speed or using simulation, so I'm taking a break until so new ideas come up
	- These are still `super good algorithms` and in my opinion best a have done
	- `Version 3` is a tiny bit faster, but not by much