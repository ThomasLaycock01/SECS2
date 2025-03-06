export class Party {
    constructor(id) {
        this.id = id;
        this.name = "Party " + id;
        this.slots = {};
        this.limit = 3;

        this.currentActivity = null;
        this.isHealing = false;
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
            if (this.slots[i].cultist && this.slots[i].cultist.getRole()) {
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
        console.log(count);
        return count;
    }

    getRoleBySlot(slotId) {
        if (this.slots[slotId].role) {
            return this.slots[slotId].role;
        }
        return null;
    }

    getCultistBySlot(slotId) {
        if (this.slots[slotId].cultist) {
            return this.slots[slotId].cultist;
        }
        return null;
    }

    getSlotByCultist(cultistId) {
        console.log(cultistId)
        for (var i in this.slots) {
            if (this.slots[i].cultist && this.slots[i].cultist.getId() == cultistId) {
                return i;
            }
        }
        console.log("error in getSlotsByCultist method")
    }


    getCurrentActivity() {
        return this.currentActivity;
    }

    getIsHealing() {
        return this.isHealing;
    }

    checkIfContainsCultist(cultistId) {
        for (var i in this.slots) {
            if (this.slots[i].cultist && this.slots[i].cultist.getId() == cultistId) {
                return true;
            }
        }
        return false;
    }

    checkFullKnockOut() {
        for (var i in this.slots) {
            if (this.slots[i].cultist && this.slots[i].cultist.getKnockedOut() == false) {
                return false;
            }
        }
        return true;
    }

    //actions
    initSlots() {
        var count = 0;

        while (count < this.limit) {
            this.slots[count] = {
                id: count,
                cultist: null
            }
            count++;
        }
    }

    setCultist(slotId, cultistObj) {
        this.slots[slotId].cultist = cultistObj;
    }

    removeCultist(slotId) {
        this.slots[slotId].cultist = null;
    }

    removeNoRoleCultists() {
        for (var i in this.slots) {
            if (this.slots[i].cultist && !this.slots[i].cultist.getRole()) {
                this.slots[i].cultist.removeParty();
                this.removeCultist(i);
            }
        }
    }

    addXp(amount) {
        
        var numOfCultists  = 0;

        for (var i in this.slots) {
            if (this.slots[i].cultist) {
                numOfCultists++;
            }
        }

        const xpShare = Math.floor(amount / numOfCultists);


        for (var i in this.slots) {
            if (this.slots[i].cultist) {
                this.slots[i].cultist.addXp(xpShare)
            }
        }
    }

    setCurrentActivity(activity = null) {
        this.currentActivity = activity;
    }

    toggleIsHealing() {
        if (this.isHealing) {
            this.isHealing = false;
            this.setCurrentActivity();
        }
        else {
            this.isHealing = true;
            this.setCurrentActivity("Healing");
        }
    }

    healCultists() {
        for (var i in this.slots) {
            if (this.slots[i].cultist) {
                this.slots[i].cultist.heal();
            }
        }
    }
}