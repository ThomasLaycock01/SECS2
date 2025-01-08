export class Area {
    constructor(obj) {
        this.id = obj.id;
        this.name = obj.name;
        this.desc = obj.desc;

        this.activeParty = null;
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

    getActive() {
        if (this.activeParty) {
            return true;
        }
        return false;
    }

    getActiveParty() {
        return this.activeParty;
    }

    //actions
    setActiveParty(partyObj) {
        this.activeparty = partyObj;
    }
}