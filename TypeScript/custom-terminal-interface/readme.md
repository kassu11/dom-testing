# Custom terminal

- I'm testing how to make a kinda working terminal
- Wanted to also test out Typescript but kinda regretting it :D
- The terminal should be able to color code your text
- The terminal autocorrects and highlights any errors and intellisense recommends commands

## Testing

- The project has Cypress installed
- I have made a couple of tests that can be run using

```
npm run e2e
```




## Syntax testing

- This is most definitely WIP

```js
const terminal = new Terminal()
new Argument("selector", {
	list: [{ ...commandArguments["@a"], next: "item" }, { ...commandArguments["@r"], next: "item" }, destructure(commandArguments["playerName"], { next: "item" })],
	type: "required",
	help: "<selector>",
	color: colors.selector,
	error(command) {
		if (command.length === 0) return "Selector is missing!"
		if (command.startsWith("@")) return `Selector "${command}" is not supported!`
		return `Player "${command}" does not exist!`
	}
});
new ArgumentValue()

terminal.addArgument("selector", {
	description: "The selector to use",
	type: "string",
}).addCommand(
	new Command("give", {
		description: "List all commands",
		arguments: [
			Argument("selector", {next: Argument("item")})
		],
		execute: () => {
			terminal.print("Available commands:")
			terminal.print(terminal.commands.map(command => command.name).join(", "))
		},
	}),

)

new Command(terminal, "echo", {
	description: "Echo a message",
});

Command(terminal, "help", {

})
```