# How to lock the mouse on hold

- If you press your mouse down in the gray box your mouse will get locked
- Because of this lock it can be tracked and can not collide with your monitor's edges
- You can see your updated `x` and `y` values at the bottom of the screen

## Observations

- The mdn documentation shows that `await` is needed, but it seems to work without it
- If the user exits the lock by pressing <kbd>esc</kbd> an error occurs when clicking the `div`
  - If you keep clicking the code will work again
- This is just a plank base code, I will make a demo with something more interesting than just the gray box