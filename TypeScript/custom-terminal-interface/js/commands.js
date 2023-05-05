"use strict";
const commands = {
    help: {
        help: "help [command] - Displays help for a command.",
        commands: {
            index: {
                list: [{ value: ["help"] }],
                type: "required"
            }
        }
    },
    give: {
        help: "give [player] [item] [count] [data] [dataTag] - Gives an item to a player.",
        commands: {
            index: {
                list: [{ value: ["give"], next: "selector" }],
                type: "required",
                color: "#cccccc"
            },
            selector: {
                list: [{ ...commandArguments["@a"], next: "item" }, { ...commandArguments["@r"], next: "item" }, { ...commandArguments["playerName"], next: "item" }],
                type: "required",
                color: "#22d3ee",
            },
            item: {
                list: [{ value: ["apple"], next: "amount" }, { value: ["sword"], next: "amount" }],
                type: "required",
                color: "#c084fc",
            },
            amount: {
                list: [{ title: "<amount>", value: ["1"], match: (value) => !isNaN(+(value)) }],
                type: "required",
                color: "#fde047"
            },
        },
        execute: ([...args]) => {
            const player = args[0];
            const item = args[1];
            const amount = args[2];
            return `give ${player} ${item} ${amount}`;
        }
    },
    tp: {
        help: "tp [player] [x] [y] [z] - Teleports a player to a location.",
        commands: {
            index: {
                list: [{ value: ["tp"], next: "selector" }],
                type: "required",
                color: "#cccccc",
                next: "selector"
            },
            selector: {
                list: [{ ...commandArguments["@a"], next: "xCords" }, { ...commandArguments["@r"], next: "xCords" }, { ...commandArguments["playerName"], next: "xCords" }],
                type: "required",
                color: "#22d3ee",
                next: "xCords"
            },
            xCords: {
                list: [{ title: "[<X>]", value: ["~"], next: "yCords", match: (value) => (!isNaN(+(value)) || value === "~") }],
                type: "required",
                color: "#fde047",
            },
            yCords: {
                list: [{ title: "[<Y>]", value: ["~"], next: "zCords", match: (value) => (!isNaN(+(value)) || value === "~") }],
                type: "required",
                color: "#fde047",
            },
            zCords: {
                list: [{ title: "[<Z>]", value: ["~"], match: (value) => (!isNaN(+(value)) || value === "~") }],
                type: "required",
                color: "#fde047"
            },
        }
    },
    test: {
        help: "test",
        commands: {
            index: {
                list: [{ value: ["test"] }],
                type: "required",
                color: "#cccccc",
                next: "second"
            },
            second: {
                list: [{ title: "long value", value: ["asdhasdhahdajshdjashdjfdjgkldfjhsdjhasfhsdjfgsjfhasfhasjdhasjdhajksdhjhfjgh"] }],
                type: "required",
                color: "#22d3ee",
                next: "third"
            },
            third: {
                list: [{ title: "[<X>]", value: ["~"], match: (value) => (!isNaN(+(value)) || value === "~") }],
                type: "required",
                color: "#fde047",
                next: "fourth"
            },
            fourth: {
                list: [{ title: "[<Y>]", value: ["~"], match: (value) => (!isNaN(+(value)) || value === "~") }],
                type: "required",
                color: "#fde047",
                next: "fifth"
            },
            fifth: {
                list: [{ title: "[<Z>]", value: ["~"], match: (value) => (!isNaN(+(value)) || value === "~") }],
                type: "required",
                color: "#fde047"
            },
        }
    },
    all: {
        help: "all [selection] - Lists all selected.",
        commands: {
            index: {
                list: [{ value: ["all"], next: "selection" }],
                type: "required"
            },
            selection: {
                list: [{ value: ["users"] }, { value: ["items"] }],
                type: "required"
            },
        },
        execute(...args) {
            if (args.length == 1)
                addErrorText("Missing argument");
            else if (args.length > 2)
                addErrorText("Too many arguments");
            else if (args[1] === "users") {
                addText("List of all the users:");
                for (const user of users)
                    addText("- " + user.name);
            }
            else if (args[1] === "items")
                addText("All items");
            else
                addErrorText(`Invalid argument "${args[1]}"`);
        },
    },
    clear: {
        help: "clear - Clears the console.",
        commands: {
            index: {
                list: [{ value: ["clear"] }],
                type: "required"
            }
        },
        execute(...args) {
            if (args.length > 1)
                addErrorText("Too many arguments");
            textContentElem.textContent = "";
        },
    },
    user: {
        help: "user [action] [name] {values} - General user management command.",
        commands: {
            index: {
                list: [{ value: ["user"], next: "second" }],
                type: "required"
            },
            second: {
                list: [{ value: ["remove", "info"], next: "endSelector" }, { value: ["add"], next: "uniqueName" }, { value: ["modify"], next: "modifySelect" }],
                type: "required"
            },
            endSelector: {
                list: [commandArguments["@a"], commandArguments["@r"], commandArguments["playerName"]],
                type: "required"
            },
            modifySelect: {
                list: [{ ...commandArguments["@a"], next: "modifyName" }, { ...commandArguments["@r"], next: "modifyName" }, { ...commandArguments["playerName"], next: "modifyName" }],
                type: "required"
            },
            modifyName: {
                list: [{ value: ["name"], next: "uniqueName" }],
                type: "required"
            },
            uniqueName: {
                list: [{
                        title: "<user name>",
                        value: ["user_name"],
                        match: (value) => value.length > 2 && users.every(user => user.name !== value)
                    }],
                type: "required"
            },
        }
    }
};
// https://stackoverflow.com/questions/75804424/is-it-possible-to-get-parent-property-name-of-nested-object-in-set-method-of-pro
//# sourceMappingURL=commands.js.map