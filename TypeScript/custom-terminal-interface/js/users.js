"use strict";
class User {
    name;
    inventory;
    x;
    y;
    z;
    hp;
    constructor(name) {
        this.name = name;
        this.inventory = [];
        this.hp = 50;
        this.x = 0;
        this.y = 0;
        this.z = 0;
    }
}
const users = [new User("pl_1"), new User("pl_2"), new User("pl_3")];
//# sourceMappingURL=users.js.map