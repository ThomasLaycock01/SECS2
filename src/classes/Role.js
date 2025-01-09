export class Role {
    constructor(obj) {
        this.id = obj.id;
        this.name = obj.name;
        this.dmgGiven = obj.dmgGiven;
        this.dmgTaken = obj.dmgTaken;
        this.mod = obj.mod;
    }

    //getters
    getId() {
        return this.id;
    }

    getName() {
        return this.name;
    }

    getDmgGiven(type) {
        return this.dmgGiven[type];
    }

    getDmgTaken(type) {
        return this.dmgTaken[type];
    }

    getMod() {
        return this.mod;
    }
}