class User {
	name: string
	inventory: any[]
	x: number
	y: number
	z: number

	constructor(name: string) {
		this.name = name
		this.inventory = []
		this.x = 0
		this.y = 0
		this.z = 0
	}
}

const users = [new User("user1"), new User("user2"), new User("user3")]