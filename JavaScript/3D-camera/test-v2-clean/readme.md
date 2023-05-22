# Better CSS fps camera

- This test `fixes all the issues` that the `first one has` otherwise the code is kinda the same
- I would recommend to read the [readme](../test-v1/) for the `test-v1` if the `problems interest you`
- This clean version has more lines, but the code is better organized and not in one file

## Changes

- Every `calculation` is now done in `js`
- The `calculations` have `not changed`, but they are `removed from the CSS`
	- This also makes it possible to `remove` all `CSS variables`
	- I like `CSS` variables, but they probably `caused a lot of issues` in the previous `test-v1`, so now their gone
	- This also `makes it easier to configure the code`, because all the changes happen in `code.js`
- Every `face` is also now a `one DOM element`
	- `Nothing is parented` and every `position` and `rotation` is done in `js`
	- Because the code doesn't just always make a `6-faced cube` which` reduces the number of faces`
		- Before:
			- <img src="https://i.imgur.com/7Lo7QY1.png" width="300">
		- After:
			- <img src="https://i.imgur.com/vf9aHvq.png" width="300">
		- Notice that the `after` image doesn't have faces in the `middle of the blocks` that the player won't even see
			- **NOTE:** The `opacity is lower in these images`, but `normally` the faces are `not seethrough`
	- Because of the `flickering` I was scared to even use `CSS classes` so every rotation etc. is given by `js` as an `inline style`
	- The faces are also only `rendered in front`
		- I set the `backface-visibility` setting to `hidden`
		- I `don't know` if this even `boosts performance`, but it was `easier to code the faces rotations` because they couldn't get a weird reversed rotation
- There are now controls to rotate the camera `90 degrees` to the `right` and `left`
	- Use the <kbd>arrow</kbd> keys to rotate your camera `smoothly 90 degrees`

## Results

- The game world `doesn't flicker` and the game `runs much smoother`
- This of course works even better on `Firefox`, but now the `Chrome` experience `is also good`