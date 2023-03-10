"use strict";
const commandArguments = {
    "playerName": {
        "help": "Selects players in the world by name",
        "valueF": () => console.log("playerName"),
        "match": (value) => value.length > 2 && !value.startsWith("@")
    },
    "@a": {
        "help": "Selects all players in the world",
        "value": "@a",
    },
    "@r": {
        "help": "Selects a random player in the world",
        "value": "@r",
    },
    "giveItem": {
        "help": "Selects an item by name",
        "valueF": () => ["minecraft:stone", "minecraft:dirt", "minecraft:grass_block"],
    }
};
//# sourceMappingURL=arguments.js.map