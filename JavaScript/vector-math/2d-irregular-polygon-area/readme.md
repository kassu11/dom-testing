# How to calculate the area of polygons

- The code contains two different methods to calculate the polygon's area
	- The other is my own implementation which is `slow` and `cool-looking`
	- The other is the `Shoelace formula`, which is 6 lines of code and does the same logic as my +100 lines of code :D
- If you want a fast and small way to calculate area, use the Shoelace formula, but if you want to know more about the visuals and how my algorithm works continue reading

## How to use

- The `first canvas` on the screen is the one where the `user can draw`
- Just `left-click` and draw what you want
	- When you are done press <kbd>Enter</kbd> to close the shape
- Right of the drawing canvas is an `animated gif` that loops through all the steps the algorithm does to calculate the area
	- The same steps are also readable down below
		- The **reading order** is left to right, top to bottom
	- The `red rectangle` is the current rectangle the **algorithm will calculate**
	- The `green point` is the selected point that **will be deleted in the next iteration**
	- The `white point` is the **center point of the triangle**

## The inner workings

- The algorithm will **break polygons down into simple triangles** and then calculate the **total area by summing them together**
- The polygon will be looped from the first point onward and anytime it finds a valid `triangle` to calculate the iteration will reset back to the `first point`
	- The triangle **is valid** only if it's not outside of the polygon
		- This is checked using the `center point`
		- If the `center point` **intersects** with an even amount of lines on its **left side** it's considered to be **inside the polygon**
	- If the `line that closes the triangle` is not intersecting any polygon lines **it's valid**
	- If any of the `polygon points` are inside of the `triangle` the **triangle is not valid**
	- **If all these 3 conditions** are med the **triangle is calculated and removed**
- When all the `polygon points` have been `turned into triangles` the **calculation is done**
- If you **don't have any overlapping lines**, the result **should be the same** as the `Shoelace formula`