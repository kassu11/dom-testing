# First try to make a CSS fps camera

- This is my first attempt at making a `3D transform-based CSS camera`
- It turned out much better than I thought but it definitely has some big issues
- These `issues` only `happen in Chromium-based browsers` and `Firefox` runs much `smoother`
- The biggest issue is that the blocks just `flicker` a lot
	- <img src="https://i.imgur.com/3aOe1EM.gif">
	- In this gif, you can see how bad the `flickering` can get
	- This only happens in `Chrome` and might be fixed in the future, because it is `100% just a CSS bug`
	- But because of this `I cannot use this` way to make a working fps camera
	- My theory is that the cause of this `problem is` the use of `parented DOM elements`
	- It might also be because of my `excessive use of CSS variables`
		- The camera is moved by `CSS variables` and all the calculations are done in `CSS` and not in `js`
		- This might be the reason for the bugs, so in the `test-v2` I do the calculations in `js` and the faces are not appended to a `block container parent`
- Second smaller issue is that you `can't make the block transparent`
- The `faces can be transparent`, but if you try to make the `block` parent `transparent` the `faces disappear`

| Transparency in faces                                   | Transparency in the block                               |
|---------------------------------------------------------|---------------------------------------------------------|
| <img src="https://i.imgur.com/7Lo7QY1.png" width="300"> | <img src="https://i.imgur.com/qLa7uQX.png" width="300"> |

## How to use

- You can move the camera with <kbd>w</kbd><kbd>a</kbd><kbd>s</kbd><kbd>d</kbd>
- Rotate your viewpoint by using your mouse
	- You will have to `click the screen` for the `pointerLock` to happen
- You can fly with <kbd>space</kbd> and <kbd>left shift</kbd>
- There are no collisions and no interactions with anything
- This is just a demo to `render a 3D world`

## Coding solutions

- Most of the calculations are done by `CSS`
	- This is only because I wanted to test if it would be possible and yes it is
	- All the important CSS parameters like `size` and `perspective` are `variables`
		- **NONE:** The `size variable` has to be changed in `js` and in `CSS`
- This demo kinda has `a map editor`, and you can expand the level and make more walls by modifying the map array in `code.js`
- Every tile is a `block` that can have `6 faces` and a face is parented to the block container 
