# Back to parent with proxy

- This proxy allows you to go backward on the object tree
- The default keyword is `"parent"`, but this can be changed easily of course
	- The parent is only accessible from objects and arrays
	- If you are located at an ending value, the parent property is not callable
	- Also the root doesn't have a parent