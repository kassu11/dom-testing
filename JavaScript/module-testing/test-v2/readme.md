# Testing more module behaviors 

- The module file runs `every line of code`, even if you only import one function.
- So it does not load a smaller version of the file, even when importing just one function.
- Because js runs on one thread if you do `top level awaits` inside the module file it runs those before your other code.
- I don't see any differences between module files and the main file that calls them.
	- The module file can access the `window` variable and make changes to the page.
	- This is most definitely not a good practice, but it can be done.
- Module is only loaded ones, so if you import the same module multiple times the file is only downloaded ones.
	- This is not tested in this file, but in `test-v1` this became very clear.