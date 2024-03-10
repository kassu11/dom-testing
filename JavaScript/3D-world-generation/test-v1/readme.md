# 3D world generation using CSS and Perlin noise

> **Disclaimer**
> This will currently only work on Firefox, and all `Chromium` based browsers will struggle to render over 1000 3D transformed elements

- This project is only `for fun` and will probably never be used in anything serious
	- The performance of the `CSS 3D rendering is awful` and I had to use super aggressive greedy meshing and low render distance even to make this demo run over `30 fps`
	- My current pc specs are `RTX 3070` and an `i7-gen 12`, still which will only run around 50 fps inside `Firefox`
- Because this demo was done super fast, it's not well optimized and this `has at least one bug`
	- I'm not sure how this happens but very rarely the tiles `between chunk borders` will `have a small gap` to see the void
	- My theory is that my custom "Perlin noise" function will sometimes give enough of a rounding difference that the tiles don't match perfectly
		- <img src="https://i.imgur.com/KBIsDAj.png" width="350" />
- If I ever do a `version 2`, I will probably make a greedy meshing algorithm that prioritizes speed and not a lower tile count
- The chunk border fix was also done super fast and because of that, I increased every chuck by one block, which means that there are duplicate tiles on the edges
	- This will cost a little performance and possibly cause some `z-fighting`, but to my knowledge, this has not been an issue yet
	- And I will take the duplicate border over no chuck borders any day
	- Here is what the chuck borders look like
	- <img src="https://i.imgur.com/iCAQJAQ.png" width="350" />