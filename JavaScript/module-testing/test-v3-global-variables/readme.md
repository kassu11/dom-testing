# JS Module global variable in the console

- Apparently, `module global variables` are `not global` to the `console`
- This is of course `much more secure` and a good default, but global console variables `help me to debug stuff a lot faster`
- Because of this I figured out a way to make `module variables truly global`
	- This method is kinda bad because it `has to be done manually to every variable` you want to make `global`
	- I tried to get a list from `window` or `self` of `all the variables` but had no luck
	- So before I find a better way you will have to make variables `public manually`
- This method is otherwise good because it respects your `const` and `let`
	- The values will never `off-sync`, because this uses `getters` and `setters`, so there is only one variable that can just be seen at both ends

