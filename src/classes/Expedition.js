export class Expedition {
    constructor(obj) {
        this.id = obj.id;
        this.name = obj.name;
        this.desc = obj.desc;

        this.encounters = obj.encounters;
        this.unlocked = false;
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

    getUnlocked() {
        return this.unlocked;
    }

    getLength() {
        return this.encounters.length;
    }

    //actions
    unlock() {
        this.unlocked = true;
    }
}