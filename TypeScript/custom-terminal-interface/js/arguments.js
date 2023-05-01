"use strict";
const commandArguments = {
    "playerName": {
        "help": "Selects players in the world by name",
        get value() {
            return users.map(user => user.name);
        },
        match(userName) {
            if (userName.startsWith("@"))
                return false;
            if (userName.length < 3)
                return false;
            return users.some(user => user.name == userName);
        },
        execute(userName) {
            return [users.some(user => user.name == userName)];
        }
    },
    "@a": {
        "help": "Selects all players in the world",
        "value": ["@a"],
        execute() {
            return users;
        }
    },
    "@r": {
        "help": "Selects a random player in the world",
        "value": ["@r"],
        execute() {
            return [users[Math.floor(Math.random() * users.length)]];
        }
    },
    "giveItem": {
        "help": "Selects an item by name",
        get value() {
            return ["minecraft:stone", "minecraft:dirt", "minecraft:grass_block"];
        },
    }
};
//# sourceMappingURL=arguments.js.map