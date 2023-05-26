"use strict";
const commandArguments = {
    playerName: {
        help: "Selects players in the world by name",
        get value() {
            return users.map(user => user.name);
        },
        match(userName) {
            if (userName.startsWith("@"))
                return false;
            if (userName.length < 3)
                return false;
            return users.some(user => user.name === userName);
        },
        execute(userName) {
            return [users.find(user => user.name === userName)];
        }
    },
    "@a": {
        help: "Selects all players in the world",
        value: ["@a"],
        execute() {
            return [...users];
        }
    },
    "@r": {
        help: "Selects a random player in the world",
        value: ["@r"],
        execute() {
            if (users.length === 0)
                return [];
            return [users[Math.floor(Math.random() * users.length)]];
        }
    },
    giveItem: {
        help: "Selects an item by name",
        get value() {
            return ["minecraft:stone", "minecraft:dirt", "minecraft:grass_block"];
        },
    },
    coordinates: {
        help: "Selects a cordinate",
        value: ["~"],
        match: (value) => {
            if (!isNaN(parseInt(value)) || value === "~")
                return true;
            return (value.startsWith("~") && !isNaN(parseInt(value.slice(1))));
        },
        execute(baseValue, command) {
            if (!isNaN(+(command)))
                return +command;
            if (command === "~")
                return baseValue;
            if (command.startsWith("~") && !isNaN(parseInt(command.slice(1)))) {
                return baseValue + parseInt(command.slice(1));
            }
            return 0;
        }
    }
};
//# sourceMappingURL=arguments.js.map