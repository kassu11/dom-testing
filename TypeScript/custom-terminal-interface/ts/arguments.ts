const commandArguments = {
	playerName: {
		help: "Selects players in the world by name",
		get value() {
			return users.map(user => user.name)
		},
		match(userName: string) {
			if (userName.startsWith("@")) return false
			if (userName.length < 3) return false
			return users.some(user => user.name === userName)
		},
		execute(userName: string) {
			return [users.find(user => user.name === userName)]
		}
	},
	"@a": {
		help: "Selects all players in the world",
		value: ["@a"],
		execute() {
			return [...users]
		}
	},
	"@r": {
		help: "Selects a random player in the world",
		value: ["@r"],
		execute() {
			if (users.length === 0) return []
			return [users[Math.floor(Math.random() * users.length)]]
		}
	},
	giveItem: {
		help: "Selects an item by name",
		get value() {
			return ["minecraft:stone", "minecraft:dirt", "minecraft:grass_block"]
		},
	},
	cordinates: {
		help: "Selects a cordinate",
		value: ["~"],
		match: (value: string) => {
			if (!isNaN(+(value)) || value === "~") return true;
			return (value.startsWith("~") && !isNaN(+(value.slice(1))))
		},
		execute(baseValue: number, command: string) {
			if (!isNaN(+(command))) return +command;
			if (command === "~") return baseValue;
			if (command.startsWith("~") && !isNaN(+(command.slice(1)))) {
				return baseValue + +(command.slice(1));
			} return 0;
		}
	}
}