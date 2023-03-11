const commands = {
	"help": {
		"help": "help [command] - Displays help for a command.",
		"commands": [
			{
				"list": [{ "value": "help" }],
				"type": "required"
			}
		]
	},
	"give": {
		"help": "give [player] [item] [count] [data] [dataTag] - Gives an item to a player.",
		"commands": [
			{
				"list": [{ "value": "give" }],
				"type": "required",
				"color": "#cccccc"
			},
			{
				"list": [{ "value": "@a" }, { "value": "@r" }, { "value": "kassu11" }],
				"type": "required",
				"color": "#22d3ee"
			},
			{
				"list": [{ "value": "apple" }, { "value": "sword" }],
				"type": "required",
				"color": "#c084fc"
			},
			{
				"list": [{ "title": "<amount>", "value": "1", "match": (value: string) => !isNaN(+(value)) }],
				"type": "required",
				"color": "#fde047"
			},
		]
	},
	"tp": {
		"help": "tp [player] [x] [y] [z] - Teleports a player to a location.",
		"commands": [
			{
				"list": [{ "value": "tp" }],
				"type": "required",
				"color": "#cccccc"
			},
			{
				"list": [{ "value": "@a" }, { "value": "@r" }, { "value": "kassu11" }],
				"type": "required",
				"color": "#22d3ee"
			},
			{
				"list": [{ "title": "[<X>]", "value": "~", "match": (value: string) => (!isNaN(+(value)) || value === "~") }],
				"type": "required",
				"color": "#fde047"
			},
			{
				"list": [{ "title": "[<Y>]", "value": "~", "match": (value: string) => (!isNaN(+(value)) || value === "~") }],
				"type": "required",
				"color": "#fde047"
			},
			{
				"list": [{ "title": "[<Z>]", "value": "~", "match": (value: string) => (!isNaN(+(value)) || value === "~") }],
				"type": "required",
				"color": "#fde047"
			},
		]
	}
	// "give": {
	// 	"help": "give [player] [item] [count] [data] [dataTag] - Gives an item to a player.",
	// 	"command": "give",
	// 	"list": [
	// 		{
	// 			"list": [commandArguments["playerName"], commandArguments["@a"], commandArguments["@r"]],
	// 			"type": "optional"
	// 		},
	// 		{
	// 			"list": [commandArguments["giveItem"]],
	// 			"type": "required"
	// 		}
	// 	]
	// }
}
