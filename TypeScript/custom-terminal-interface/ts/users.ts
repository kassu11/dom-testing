class User {
	name: string
	inventory: any[]
	x: number
	y: number
	z: number
	hp: number

	constructor(name: string) {
		this.name = name;
		this.inventory = [];
		this.hp = 50;
		this.x = 0;
		this.y = 0;
		this.z = 0;
	}
}

const users = [new User("pl_1"), new User("pl_2"), new User("pl_3")]