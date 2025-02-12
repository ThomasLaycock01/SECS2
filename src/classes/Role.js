export class Role {
    constructor(obj) {
        this.id = obj.id;
        this.name = obj.name;
        this.desc = obj.desc;

        this.dmgGiven = obj.dmgGiven;
        this.dmgTaken = obj.dmgTaken;
    }

    //getters
    getId() {
        return this.id;
    }

    getName() {
        return this.name;
    }

    getDesc() {
        return this.desc;
    }

    getDmgGiven(type) {
        return this.dmgGiven[type];
    }

    getDmgTaken(type) {
        return this.dmgTaken[type];
    }
}