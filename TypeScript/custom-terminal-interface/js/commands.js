"use strict";
const colors = {
    argument: "#cccccc",
    entity: "#c084fc",
    selector: "#22d3ee",
    value: "#fde047",
    option: "#69ff91",
};
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
                color: colors.argument
            },
            selector: {
                list: [{ ...commandArguments["@a"], next: "item" }, { ...commandArguments["@r"], next: "item" }, destructure(commandArguments["playerName"], { next: "item" })],
                type: "required",
                color: colors.selector,
            },
            item: {
                list: [{ value: ["apple"], next: "amount" }, { value: ["sword"], next: "amount" }],
                type: "required",
                color: colors.entity,
            },
            amount: {
                list: [{ title: "<amount>", value: ["1"], match: (value) => !isNaN(+(value)) }],
                type: "required",
                color: colors.value
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
                color: colors.argument,
                next: "selector"
            },
            selector: {
                list: [{ ...commandArguments["@a"], next: "xCords" }, { ...commandArguments["@r"], next: "xCords" }, { ...commandArguments["playerName"], next: "xCords" }],
                type: "required",
                color: colors.selector,
                next: "xCords"
            },
            xCords: {
                list: [{ title: "[<X>]", value: ["~"], next: "yCords", match: (value) => (!isNaN(+(value)) || value === "~") }],
                type: "required",
                color: colors.value,
            },
            yCords: {
                list: [{ title: "[<Y>]", value: ["~"], next: "zCords", match: (value) => (!isNaN(+(value)) || value === "~") }],
                type: "required",
                color: colors.value,
            },
            zCords: {
                list: [{ title: "[<Z>]", value: ["~"], match: (value) => (!isNaN(+(value)) || value === "~") }],
                type: "required",
                color: colors.value
            },
        }
    },
    test: {
        help: "test",
        commands: {
            index: {
                list: [{ value: ["test"], next: "second" }],
                type: "required",
                color: colors.argument,
            },
            second: {
                list: [{ title: "long value", value: ["asdhasdhahdajshdjashdjfdjgkldfjhsdjhasfhsdjfgsjfhasfhasjdhasjdhajksdhjhfjgh"], next: "third" }],
                type: "required",
                color: colors.selector,
            },
            third: {
                list: [{ title: "[<X>]", value: ["~"], next: "fourth", match: (value) => (!isNaN(+(value)) || value === "~") }],
                type: "required",
                color: colors.value,
            },
            fourth: {
                list: [{ title: "[<Y>]", value: ["~"], next: "fifth", match: (value) => (!isNaN(+(value)) || value === "~") }],
                type: "required",
                color: colors.value,
            },
            fifth: {
                list: [{ title: "[<Z>]", value: ["~"], match: (value) => (!isNaN(+(value)) || value === "~") }],
                type: "required",
                color: colors.value
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
        color: colors.argument,
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
                type: "required",
                color: colors.argument
            },
            second: {
                list: [{ value: ["remove", "info"], next: "endSelector" }, { value: ["add"], next: "uniqueName" }, { value: ["modify"], next: "modifySelect" }],
                type: "required",
                color: colors.option
            },
            endSelector: {
                list: [commandArguments["@a"], commandArguments["@r"], commandArguments["playerName"]],
                type: "required",
                color: colors.selector
            },
            modifySelect: {
                list: [{ ...commandArguments["@a"], next: "modifyName" }, { ...commandArguments["@r"], next: "modifyName" }, { ...commandArguments["playerName"], next: "modifyName" }],
                type: "required",
                color: colors.selector
            },
            modifyName: {
                list: [{ value: ["name"], next: "uniqueName" }],
                type: "required",
                color: colors.option
            },
            uniqueName: {
                list: [{
                        title: "<user name>",
                        value: ["user_name"],
                        match: (value) => value.length > 2 && users.every(user => user.name !== value)
                    }],
                type: "required",
                color: colors.value
            },
        },
        execute(...args) {
            const path = traceCommandPath(args, true, true);
            const errorIndex = path.findIndex(p => p === null);
            if (errorIndex !== -1) {
                addErrorText(`Invalid argument "${args[errorIndex]}"`);
                return;
            }
            else if (args[1] === "remove" || args[1] === "info") {
                const selected = path[2].execute(args[2]);
                for (const user of selected) {
                    if (args[1] === "remove") {
                        users.splice(users.findIndex(u => u.name === user.name), 1);
                        addText(`Removed user "${user.name}"`);
                    }
                    else if (args[1] === "info") {
                        addText(`User "${user.name}":`);
                        addText(`- Inventory: ${JSON.stringify(user.inventory)}`);
                    }
                }
            }
            else if (args[1] === "add") {
                users.push(new User(args[2]));
                addText(`Added user "${args[2]}"`);
            }
            else if (args[1] === "modify") {
                if (args[3] === "name") {
                    const selected = path[2].execute(args[2]);
                    const baseName = args[4];
                    if (selected.length === 1) {
                        addText(`Changed user "${selected[0].name}" name to "${baseName}"`);
                        selected[0].name = baseName;
                        return;
                    }
                    let counter = 1;
                    main: for (const user of selected) {
                        for (let i = 0; i < 100; i++) {
                            if (users.every(u => u.name !== baseName + counter)) {
                                addText(`Changed user "${user.name}" name to "${baseName + counter}"`);
                                user.name = `${baseName}${counter++}`;
                                continue main;
                            }
                        }
                    }
                }
            }
        },
    }
};
//# sourceMappingURL=commands.js.map