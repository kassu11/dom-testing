# CSS :is selector

- The `is:()` selector didn't work like I thought it will
- It can check elements that are parents to the starting element
	- This is not normally possible in CSS
	- Don't really think this is useful, because the ending element has to still be a child that is the deepest element of the selector, but maybe I will find uses for this
	- This behavior can also easily cause bugs :D

## Explonation

- The selector that is used is:

```css
.one :is(.two .three) {
	background-color: red;
}
```

- The second element contains `.two > .one > three` dom tree so you would think that the `.three` element would not get selected
- But it stats at `.one` and then sees that `.three` is a deeper child, so even tho the element `.one` is elements `.two` parent, this still works
	- Basically, the logic this checks is that `.three` is inside `.one`
	- And `.three` is also inside of `.two` so the selector works