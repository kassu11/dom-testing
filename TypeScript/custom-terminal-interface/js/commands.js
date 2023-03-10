"use strict";
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
                "type": "required"
            },
            {
                "list": [{ "value": "@a" }, { "value": "@r" }, { "value": "kassu11" }],
                "type": "required"
            },
            {
                "list": [{ "value": "apple" }, { "value": "sword" }],
                "type": "required"
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
};
//# sourceMappingURL=commands.js.map