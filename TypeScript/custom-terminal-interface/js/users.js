"use strict";
class User {
    name;
    inventory;
    x;
    y;
    z;
    constructor(name) {
        this.name = name;
        this.inventory = [];
        this.x = 0;
        this.y = 0;
        this.z = 0;
    }
}
const users = [new User("user1"), new User("user2"), new User("user3")];
//# sourceMappingURL=users.js.map