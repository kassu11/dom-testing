class User {
	name: string
	inventory: string[]

	constructor(name: string) {
		this.name = name
		this.inventory = []
	}
}

const users = [new User("user1"), new User("user2"), new User("user3")]