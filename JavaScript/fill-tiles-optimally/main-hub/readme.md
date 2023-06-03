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

