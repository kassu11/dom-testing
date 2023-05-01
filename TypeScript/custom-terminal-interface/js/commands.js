"use strict";
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
                "list": [{ "title": "<amount>", "value": ["1"], "match": (value) => !isNaN(+(value)) }],
                "type": "required",
                "color": "#fde047"
            },
        ],
        "execute": ([...args]) => {
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
                "list": [{ "title": "[<X>]", "value": ["~"], "match": (value) => (!isNaN(+(value)) || value === "~") }],
                "type": "required",
                "color": "#fde047"
            },
            {
                "list": [{ "title": "[<Y>]", "value": ["~"], "match": (value) => (!isNaN(+(value)) || value === "~") }],
                "type": "required",
                "color": "#fde047"
            },
            {
                "list": [{ "title": "[<Z>]", "value": ["~"], "match": (value) => (!isNaN(+(value)) || value === "~") }],
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
                "list": [{ "title": "[<X>]", "value": ["~"], "match": (value) => (!isNaN(+(value)) || value === "~") }],
                "type": "required",
                "color": "#fde047"
            },
            {
                "list": [{ "title": "[<Y>]", "value": ["~"], "match": (value) => (!isNaN(+(value)) || value === "~") }],
                "type": "required",
                "color": "#fde047"
            },
            {
                "list": [{ "title": "[<Z>]", "value": ["~"], "match": (value) => (!isNaN(+(value)) || value === "~") }],
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
        execute(...args) {
            if (args.length == 1)
                addErrorText("Missing argument");
            else if (args.length > 2)
                addErrorText("Too many arguments");
            else if (args[1] === "users")
                addText("All users");
            else if (args[1] === "items")
                addText("All items");
            else
                addErrorText("Invalid argument");
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
        execute(...args) {
            if (args.length > 1)
                addErrorText("Too many arguments");
            textContentElem.textContent = "";
        },
    }
};
//# sourceMappingURL=commands.js.map