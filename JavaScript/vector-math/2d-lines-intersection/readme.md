# Detect intersections between lines

- Simple line intersection detection algorithm
	- If you want the detection to be with infinite lines, remove the `vectorInRange` checks
	- If you want the lines to be path tracing but the intersection point has to be inside the lines hitbox, change the logic as follows

``js
// Current logic
if(!vectorInRange(vector1, x, y) || !vectorInRange(vector2, x, y)) return false;

// Change to
if(!vectorInRange(vector1, x, y) && !vectorInRange(vector2, x, y)) return false;
```

- This is my first attempt at intersection maths, so they are probably sub-optimal at best