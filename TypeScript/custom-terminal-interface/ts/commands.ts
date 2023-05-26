const colors = {
	argument: "#cccccc",
	entity: "#c084fc",
	selector: "#22d3ee",
	value: "#fde047",
	option: "#69ff91",
} as const

const commands = {
	help: {
		help: "help - Displays more specific information about selected command.",
		commands: {
			index: {
				list: [{ value: ["help"], next: "command" }],
				type: "required",
				color: colors.argument,
			},
			command: {
				list: [{
					get value() {
						return Object.keys(commands).map(key => key);
					}
				}],
				help: "[<command>]",
				type: "optional",
				color: colors.option,
				error(command: string) {
					return `Command "${command}" is not supported! Type "help" to see all supported commands.`
				}
			}
		},
		execute(...args: string[]) {
			const path = traceCommandPath(args, true, true);
			const error = hasErrors(args, path, this);
			if (error) return addErrorText(error);

			if (args.length === 1) {
				Object.values(commands).forEach((value) => {
					if (value.help) addText(value.help)
				})
			} else {
				// @ts-ignore
				const command = commands[args[1]];
				addText(command.help)
				addText("\nCommand structure:")
				console.log(command)
				recursion(args[1], command.commands[command.commands.index.list[0].next]);

				function recursion(text: string, curCommand: any) {
					const paths: string[] = [];
					if (!curCommand) return addText(text);

					const count = new Set(curCommand.list.map((list: any) => list?.next ?? "")).size;
					if (count > 1) addText(text + ` ${curCommand.help} ...`);
					curCommand?.list.forEach((list: any) => {
						if (paths.includes(list.next)) return;
						paths.push(list.next);

						if (count > 1) recursion(text + ` ${list.value[0]}`, command.commands[list.next])
						else recursion(text + ` ${curCommand.help}`, command.commands[list.next])
					});
				}
			}
		}
	},
	give: {
		help: "give - Gives an item to a player.",
		commands: {
			index: {
				list: [{ value: ["give"], next: "selector" }],
				type: "required",
				color: colors.argument
			},
			selector: {
				list: [{ ...commandArguments["@a"], next: "item" }, { ...commandArguments["@r"], next: "item" }, destructure(commandArguments["playerName"], { next: "item" })],
				type: "required",
				help: "<selector>",
				color: colors.selector,
				error(command: string) {
					if (command.length === 0) return "Selector is missing!"
					if (command.startsWith("@")) return `Selector "${command}" is not supported!`
					return `Player "${command}" does not exist!`
				}
			},
			item: {
				list: [{ value: ["apple"], next: "amount" }, { value: ["sword"], next: "amount" }],
				type: "required",
				help: "<item>",
				color: colors.entity,
			},
			amount: {
				list: [{ title: "<amount>", value: ["1"], match: (value: string) => !isNaN(+(value)) }],
				type: "optional",
				help: "[<amount>]",
				color: colors.value,
				error(command: string) {
					return `"${command}" is not a number!`
				}
			},
		},
		execute(...args: string[]) {
			const path = traceCommandPath(args, true, true);
			const error = hasErrors(args, path, this);
			if (error) return addErrorText(error);

			const selectedUsers = path[1].execute(args[1]) as User[]
			const count = args[3] ? +args[3] : 1;
			selectedUsers.forEach(user => {
				user.inventory.push({ item: args[2], count })
				addText(`Gave ${count} ${args[2]} to ${user.name}`)
			});
		}
	},
	tp: {
		help: "tp - Teleports a player to a specified location.",
		commands: {
			index: {
				list: [{ value: ["tp"], next: "selector" }],
				type: "required",
				color: colors.argument,
				next: "selector"
			},
			selector: {
				list: [{ ...commandArguments["@a"], next: "xCords" }, { ...commandArguments["@r"], next: "xCords" }, destructure(commandArguments["playerName"], { next: "xCords" })],
				type: "required",
				help: "<selector>",
				color: colors.selector,
				next: "xCords",
				error(command: string) {
					if (command.length === 0) return "Selector is missing!"
					if (command.startsWith("@")) return `Selector "${command}" is not supported!`
					return `Player "${command}" does not exist!`
				}
			},
			xCords: {
				list: [{ ...commandArguments["cordinates"], next: "yCords" }],
				type: "required",
				help: "<x>",
				color: colors.value,
				error(command: string) {
					if (command.length === 0) return "X cordinate is missing!"
					if (command.startsWith("~")) return `"${command.slice(1)}" is not a number!`;
					return `"${command}" is not a number!`
				}
			},
			yCords: {
				list: [{ ...commandArguments["cordinates"], next: "zCords" }],
				type: "required",
				help: "<y>",
				color: colors.value,
				error(command: string) {
					if (command.length === 0) return "Y cordinate is missing!"
					if (command.startsWith("~")) return `"${command.slice(1)}" is not a number!`;
					return `"${command}" is not a number!`
				}
			},
			zCords: {
				list: [{ ...commandArguments["cordinates"] }],
				type: "required",
				help: "<z>",
				color: colors.value,
				error(command: string) {
					if (command.length === 0) return "Z cordinate is missing!"
					if (command.startsWith("~")) return `"${command.slice(1)}" is not a number!`;
					return `"${command}" is not a number!`
				}
			},
		},
		execute(...args: string[]) {
			const path = traceCommandPath(args, true, true)
			const error = hasErrors(args, path, this)
			if (error) return addErrorText(error)

			const selectedUsers = path[1].execute(args[1]) as User[]
			selectedUsers.forEach(user => {
				user.x = path[2].execute(user.x, args[2]) as number
				user.y = path[3].execute(user.y, args[3]) as number
				user.z = path[4].execute(user.z, args[4]) as number
				addText(`Teleported ${user.name} to ${user.x} ${user.y} ${user.z}`)
			});
		}
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
		execute(...args: string[]) {
			if (args.length > 1) addErrorText("Too many arguments")
			textContentElem.textContent = ""
		},
	},
	player: {
		help: "player - General player management command.",
		commands: {
			index: {
				list: [{ value: ["player"], next: "second" }],
				type: "required",
				color: colors.argument
			},
			second: {
				list: [{ value: ["remove", "info"], next: "endSelector" }, { value: ["add"], next: "uniqueName" }, { value: ["modify"], next: "modifySelect" }],
				type: "required",
				help: "<action>",
				color: colors.option
			},
			endSelector: {
				list: [commandArguments["@a"], commandArguments["@r"], commandArguments["playerName"]],
				type: "required",
				help: "<selector>",
				color: colors.selector,
				error(command: string) {
					if (command.length === 0) return "Selector is missing!"
					if (command.startsWith("@")) return `Selector "${command}" is not supported!`
					return `Player "${command}" does not exist!`
				}
			},
			modifySelect: {
				list: [{ ...commandArguments["@a"], next: "modifyName" }, { ...commandArguments["@r"], next: "modifyName" }, destructure(commandArguments["playerName"], { next: "modifyName" })],
				type: "required",
				help: "<selector>",
				color: colors.selector,
				error(command: string) {
					if (command.length === 0) return "Selector is missing!"
					if (command.startsWith("@")) return `Selector "${command}" is not supported!`
					return `Player "${command}" does not exist!`
				}
			},
			modifyName: {
				list: [{ value: ["name"], next: "uniqueName" }, { value: ["health"], next: "health" }],
				type: "required",
				help: "<property>",
				color: colors.option
			},
			uniqueName: {
				list: [{
					title: "<player name>",
					value: ["player_name"],
					match: (value: string) => value.length > 2 && users.every(user => user.name !== value) && !value.startsWith("@")
				}],
				type: "required",
				help: "<new name>",
				color: colors.value,
				error(command: string) {
					if (command.length < 3) return "Player name must be at least 3 characters long!"
					if (command.startsWith("@")) return `@ is reserved for selectors! You can't start player name with it!`
					return `Player with name "${command}" already exists!`
				}
			},
			health: {
				list: [{
					title: "<value>",
					value: ["50"],
					match: (value: string) => !isNaN(+value)
				}],
				type: "required",
				help: "<value>",
				color: colors.value,
				error(command: string) {
					if (command.length === 0) return "Health value is missing!"
					return `"${command}" is not a number!`
				}
			},
		},
		execute(...args: string[]) {
			const path = traceCommandPath(args, true, true)
			const error = hasErrors(args, path, this)
			if (error) return addErrorText(error)
			if (args[1] === "remove" || args[1] === "info") {
				const selected = path[2].execute(args[2]) as User[]
				for (const player of selected) {
					if (args[1] === "remove") {
						users.splice(users.findIndex(u => u.name === player.name), 1)
						addText(`Removed player "${player.name}"`)
					} else if (args[1] === "info") {
						JSON.stringify(player, null, 2).split("\n").forEach(line => addText(line.replaceAll('"', "")));
					}
				}
			} else if (args[1] === "add") {
				users.push(new User(args[2]))
				addText(`Added player "${args[2]}"`)
			} else if (args[1] === "modify") {
				const selected = path[2].execute(args[2]) as User[]
				if (args[3] === "name") {
					const baseName = args[4]
					if (selected.length === 1) {
						addText(`Changed player "${selected[0].name}" name to "${baseName}"`)
						selected[0].name = baseName
						return
					}
					let counter = 1
					main: for (const player of selected) {
						for (let i = 0; i < 100; i++) {
							if (users.every(u => u.name !== baseName + counter)) {
								addText(`Changed player "${player.name}" name to "${baseName + counter}"`)
								player.name = `${baseName}${counter++}`
								continue main;
							}
						}
					}
				} else if (args[3] === "health") {
					const value = +args[4]
					for (const player of selected) {
						player.hp = value
						addText(`Changed player "${player.name}" health to "${value}"`)
					}
				}
			}
		},
	},
	settings: {
		help: "settings - General settings about the terminal.",
		commands: {
			index: {
				list: [{ value: ["settings"], next: "second" }],
				type: "required",
				color: colors.argument
			},
			second: {
				list: [
					{ value: ["commandStructureInfo"], next: "boolean" },
					{ value: ["hideIntellisenseBox"], next: "boolean" },
					{ value: ["closeIntellisenseAfterTab"], next: "boolean" },
					{ value: ["smartIntellisense"], next: "boolean" },
				],
				type: "required",
				help: "<property>",
				color: colors.option
			},
			boolean: {
				list: [{ value: ["true"] }, { value: ["false"] }],
				type: "optional",
				help: "[<boolean>]",
				color: colors.value,
				error(command: string) {
					return `"${command}" is not a boolean!`
				}
			}
		},
		execute(...args: string[]) {
			const path = traceCommandPath(args, true, true)
			const error = hasErrors(args, path, this)
			if (error) return addErrorText(error)

			// @ts-ignore
			if (args.length === 2) addText(`${args[1]}: ${settings[args[1]]}`)
			else if (args[1] in settings) {
				// @ts-ignore
				settings[args[1]] = args[2] === "true"
				addText(`Changed ${args[1]} to ${args[2]}`)
				localStorage.setItem("terminalSettings", JSON.stringify(settings))
			}

		}
	}
} as const
