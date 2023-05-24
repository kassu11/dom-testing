const colors = {
	argument: "#cccccc",
	entity: "#c084fc",
	selector: "#22d3ee",
	value: "#fde047",
	option: "#69ff91",
} as const

const commands = {
	help: {
		help: "help [command] - Displays help for a command.",
		commands: {
			index: {
				list: [{ value: ["help"], next: "command" }],
				type: "required",
				color: colors.argument,
			},
			command: {
				list: [{
					get value() {
						return Object.keys(commands).map(key => key).filter(key => key !== "help")
					}
				}],
				type: "optional",
				color: colors.option,
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
				help: "<selector>",
				color: colors.selector,
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
				color: colors.value
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
		help: "tp [player] [x] [y] [z] - Teleports a player to a location.",
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
				next: "xCords"
			},
			xCords: {
				list: [{ ...commandArguments["cordinates"], next: "yCords" }],
				type: "required",
				help: "<x>",
				color: colors.value,
			},
			yCords: {
				list: [{ ...commandArguments["cordinates"], next: "zCords" }],
				type: "required",
				help: "<y>",
				color: colors.value,

			},
			zCords: {
				list: [{ ...commandArguments["cordinates"] }],
				type: "required",
				help: "<z>",
				color: colors.value
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
				help: "<action>",
				color: colors.option
			},
			endSelector: {
				list: [commandArguments["@a"], commandArguments["@r"], commandArguments["playerName"]],
				type: "required",
				help: "<selector>",
				color: colors.selector

			},
			modifySelect: {
				list: [{ ...commandArguments["@a"], next: "modifyName" }, { ...commandArguments["@r"], next: "modifyName" }, destructure(commandArguments["playerName"], { next: "modifyName" })],
				type: "required",
				help: "<selector>",
				color: colors.selector
			},
			modifyName: {
				list: [{ value: ["name"], next: "uniqueName" }],
				type: "required",
				help: "<property>",
				color: colors.option
			},
			uniqueName: {
				list: [{
					title: "<user name>",
					value: ["user_name"],
					match: (value: string) => value.length > 2 && users.every(user => user.name !== value)
				}],
				type: "required",
				help: "<new name>",
				color: colors.value
			},
		},
		execute(...args: string[]) {
			const path = traceCommandPath(args, true, true)
			const error = hasErrors(args, path, this)
			if (error) return addErrorText(error)
			if (args[1] === "remove" || args[1] === "info") {
				const selected = path[2].execute(args[2]) as User[]
				for (const user of selected) {
					if (args[1] === "remove") {
						users.splice(users.findIndex(u => u.name === user.name), 1)
						addText(`Removed user "${user.name}"`)
					} else if (args[1] === "info") {
						addText(`User "${user.name}":`)
						addText(`- Inventory: ${JSON.stringify(user.inventory)}`)
						addText(`- X: ${user.x}`)
						addText(`- Y: ${user.y}`)
						addText(`- Z: ${user.z}`)
					}
				}
			} else if (args[1] === "add") {
				users.push(new User(args[2]))
				addText(`Added user "${args[2]}"`)
			} else if (args[1] === "modify") {
				if (args[3] === "name") {
					const selected = path[2].execute(args[2]) as User[]
					const baseName = args[4]

					if (selected.length === 1) {
						addText(`Changed user "${selected[0].name}" name to "${baseName}"`)
						selected[0].name = baseName
						return
					}
					let counter = 1
					main: for (const user of selected) {
						for (let i = 0; i < 100; i++) {
							if (users.every(u => u.name !== baseName + counter)) {
								addText(`Changed user "${user.name}" name to "${baseName + counter}"`)
								user.name = `${baseName}${counter++}`
								continue main;
							}
						}
					}
				}
			}
		},
	}
} as const
