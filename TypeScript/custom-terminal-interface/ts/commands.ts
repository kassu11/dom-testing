const commands = {
	"help": {
		"help": "help [command] - Displays help for a command.",
		"commands": [
			{
				"list": [{ "value": ["help"] }],
				"type": "required"
			}
		]
	},
	"give": {
		"help": "give [player] [item] [count] [data] [dataTag] - Gives an item to a player.",
		"commands": [
			{
				"list": [{ "value": ["give"] }],
				"type": "required",
				"color": "#cccccc"
			},
			{
				"list": [commandArguments["@a"], commandArguments["@r"], commandArguments["playerName"]],
				"type": "required",
				"color": "#22d3ee"
			},
			{
				"list": [{ "value": ["apple"] }, { "value": ["sword"] }],
				"type": "required",
				"color": "#c084fc"
			},
			{
				"list": [{ "title": "<amount>", "value": ["1"], "match": (value: string) => !isNaN(+(value)) }],
				"type": "required",
				"color": "#fde047"
			},
		],
		"execute": ([...args]: string[]) => {
			const player = args[0];
			const item = args[1];
			const amount = args[2];
			return `give ${player} ${item} ${amount}`;
		}
	},
	"tp": {
		"help": "tp [player] [x] [y] [z] - Teleports a player to a location.",
		"commands": [
			{
				"list": [{ "value": ["tp"] }],
				"type": "required",
				"color": "#cccccc"
			},
			{
				"list": [commandArguments["@a"], commandArguments["@r"], commandArguments["playerName"]],
				"type": "required",
				"color": "#22d3ee"
			},
			{
				"list": [{ "title": "[<X>]", "value": ["~"], "match": (value: string) => (!isNaN(+(value)) || value === "~") }],
				"type": "required",
				"color": "#fde047"
			},
			{
				"list": [{ "title": "[<Y>]", "value": ["~"], "match": (value: string) => (!isNaN(+(value)) || value === "~") }],
				"type": "required",
				"color": "#fde047"
			},
			{
				"list": [{ "title": "[<Z>]", "value": ["~"], "match": (value: string) => (!isNaN(+(value)) || value === "~") }],
				"type": "required",
				"color": "#fde047"
			},
		]
	},
	"test": {
		"help": "test",
		"commands": [
			{
				"list": [{ "value": ["test"] }],
				"type": "required",
				"color": "#cccccc"
			},
			{
				"list": [{ "title": "long value", "value": ["asdhasdhahdajshdjashdjfdjgkldfjhsdjhasfhsdjfgsjfhasfhasjdhasjdhajksdhjhfjgh"] }],
				"type": "required",
				"color": "#22d3ee"
			},
			{
				"list": [{ "title": "[<X>]", "value": ["~"], "match": (value: string) => (!isNaN(+(value)) || value === "~") }],
				"type": "required",
				"color": "#fde047"
			},
			{
				"list": [{ "title": "[<Y>]", "value": ["~"], "match": (value: string) => (!isNaN(+(value)) || value === "~") }],
				"type": "required",
				"color": "#fde047"
			},
			{
				"list": [{ "title": "[<Z>]", "value": ["~"], "match": (value: string) => (!isNaN(+(value)) || value === "~") }],
				"type": "required",
				"color": "#fde047"
			},
		]
	},
	"all": {
		"help": "all [selection] - Lists all selected.",
		"commands": [
			{
				"list": [{ "value": ["all"] }],
				"type": "required"
			},
			{
				"list": [{ "value": ["users"] }, { "value": ["items"] }],
				"type": "required"
			},
		],
		execute(...args: string[]) {
			if (args.length == 1) addErrorText("Missing argument")
			else if (args.length > 2) addErrorText("Too many arguments")
			else if (args[1] === "users") {
				addText("List of all the users:")
				for (const user of users) addText("- " + user.name)
			}
			else if (args[1] === "items") addText("All items")
			else addErrorText(`Invalid argument "${args[1]}"`)
		},
	},
	"clear": {
		"help": "clear - Clears the console.",
		"commands": [
			{
				"list": [{ "value": ["clear"] }],
				"type": "required"
			}
		],
		execute(...args: string[]) {
			if (args.length > 1) addErrorText("Too many arguments")
			textContentElem.textContent = ""
		},
	},
	"user": {
		"help": "user [action] [name] {values} - General user management command.",
		"commands": [
			{
				"list": [{ "value": ["user"] }],
				"type": "required"
			},
			{
				"list": [{ "value": ["add"] }, { "value": ["remove"] }, { "value": ["modify"] }, { "value": ["info"] }],
				"type": "required"
			},
			{
				"list": [commandArguments["@a"], commandArguments["@r"], commandArguments["playerName"]],
				"type": "required"
			},
			{
				"list": [{ "title": "name", "value": ["<name>"], "match": (value: string) => value.length > 0 }],
				"type": "required",
				e() { console.log(this) }
			}
		]
	}
}


// https://stackoverflow.com/questions/75804424/is-it-possible-to-get-parent-property-name-of-nested-object-in-set-method-of-pro
