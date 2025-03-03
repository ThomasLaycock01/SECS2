export class Role {
    constructor(obj) {
        this.id = obj.id;
        this.name = obj.name;
        this.desc = obj.desc;

        this.atkMod = obj.atkMod;
        this.defMod = obj.defMod;
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

    getAtkMod(type) {
        return this.atkMod[type];
    }

    getDefMod(type) {
        return this.defMod[type];
    }
}