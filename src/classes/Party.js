export class Party {
    constructor(id) {
        this.id = id;
        this.name = "Party " + id;
        this.slots = {};
        this.limit = 3;
    }

    //getters
    getId() {
        return this.id;
    }

    getName() {
        return this.name;
    }

    getLimit() {
        return this.limit;
    }

    getSlots() {
        return this.slots;
    }

    getPartySize() {
        var count = 0;

        for (var i in this.slots) {
            if (this.slots[i].role) {
                count++;
            }
        }

        return count;
    }

    getPartyCultistCount() {
        var count = 0;
        for (var i in this.slots) {
            if (this.slots[i].cultist) {
                count++;
            }
        }

        return count;
    }

    getRoleBySlot(slotId) {
        if (this.slots[slotId].role) {
            return this.slots[slotId].role.getId();
        }
        return null;
    }

    //actions
    initSlots() {
        var count = 0;

        while (count < this.limit) {
            this.slots[count] = {
                id: count,
                role: null,
                cultist: null
            }
            count++;
        }
        console.log(this.slots);
    }

    setRole(slotId, roleObj) {
        this.slots[slotId].role = roleObj;
    }

    setCultist(slotId, cultistObj) {
        this.slots[slotId].cultist = cultistObj;
    }
}