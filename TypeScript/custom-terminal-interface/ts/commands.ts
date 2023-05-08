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
				list: [{ value: ["help"] }],
				type: "required"
			}
		},
		execute(...args: string[]) {
			Object.values(commands).forEach((value) => {
				if (value.help) addText(value.help)
			})
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
				list: [{ title: "<amount>", value: ["1"], match: (value: string) => !isNaN(+(value)) }],
				type: "required",
				color: colors.value
			},
		},
		execute: (...args: string[]) => {
			const path = traceCommandPath(args, true, true)
			const errorIndex = path.findIndex(p => p === null)
			if (errorIndex !== -1) return addErrorText(`Invalid argument "${args[errorIndex]}"`)

			const selectedUsers = path[1].execute(args[1]) as User[]
			selectedUsers.forEach(user => {
				user.inventory.push({ item: args[2], count: +args[3] })
				addText(`Gave ${args[3]} ${args[2]} to ${user.name}`)
			})
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
				list: [{ ...commandArguments["cordinates"], title: "[<X>]", next: "yCords" }],
				type: "required",
				color: colors.value,
			},
			yCords: {
				list: [{ ...commandArguments["cordinates"], title: "[<Y>]", next: "zCords" }],
				type: "required",
				color: colors.value,

			},
			zCords: {
				list: [{ ...commandArguments["cordinates"], title: "[<Z>]" }],
				type: "required",
				color: colors.value
			},
		},
		execute: (...args: string[]) => {
			const path = traceCommandPath(args, true, true)
			const errorIndex = path.findIndex(p => p === null)
			if (errorIndex !== -1) return addErrorText(`Invalid argument "${args[errorIndex]}"`)

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
					match: (value: string) => value.length > 2 && users.every(user => user.name !== value)
				}],
				type: "required",
				color: colors.value
			},
		},
		execute(...args: string[]) {
			const path = traceCommandPath(args, true, true)
			const errorIndex = path.findIndex(p => p === null)
			if (errorIndex !== -1) return addErrorText(`Invalid argument "${args[errorIndex]}"`)

			else if (args[1] === "remove" || args[1] === "info") {
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
