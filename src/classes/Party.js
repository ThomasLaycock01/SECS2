import { getGlobalModifiers } from "@/functions";

export class Party {
    constructor(id) {
        this.id = id;
        this.name = "Party " + id;
        this.slots = {};

        this.currentActivity = null;
        this.autoHeal = false;
    }

    //getters
    getId() {
        return this.id;
    }

    getName() {
        return this.name;
    }

    getLimit() {
        return Math.floor(3 + (getGlobalModifiers(['slotLimit'])));
    }

    getSlots() {
        return this.slots;
    }

    getFreeSlots() {
        const numSlots = Object.keys(this.slots).length;

        return this.getLimit() - numSlots;
    }

    getCultistBySlot(slot) {
        if (this.slots[slot]) {
            return this.slots[slot]
        }
        return null;
    }

    getPartySize() {
        var count = 0;

        for (var i in this.slots) {
            count++;
        }

        return count;
    }


    getCurrentActivity() {
        return this.currentActivity;
    }

    getAutoHeal() {
        return this.autoHeal;
    }

    checkIfContainsCultist(cultistId) {
        for (var i in this.slots) {
            if (this.slots[i].getId() == cultistId) {
                return true;
            }
        }
        return false;
    }

    checkFullKnockOut() {
        for (var i in this.slots) {
            if (this.slots[i].getKnockedOut() == false) {
                return false;
            }
        }
        return true;
    }

    checkFullHealth() {
        for (var i in this.slots) {
            if (this.slots[i].getMissingHP() != 0) {
                return false;
            }
        }
        return true;
    }

    getGrainHealCost() {
        var cost = 0;

        for (var i in this.slots) {
            cost += this.slots[i].getMissingHP();
        }

        return cost * 100;
    }

    //actions

    setCultist(slotId, cultistObj) {
        this.slots[slotId] = cultistObj;
    }

    removeCultist(slotId) {
        this.slots[slotId] = null;
        delete this.slots[slotId];
    }

    //called when a party is not saved - this is called before it is deleted
    removeCultistsForNoSave() {
        for (var i in this.slots) {
            this.slots[i].removeParty();
        }
    }

    addXp(amount) {
        
        const xpShare = Math.floor(amount / this.getPartySize());


        for (var i in this.slots) {
            this.slots[i].addXp(xpShare)
        }
    }

    setCurrentActivity(activity = null) {
        this.currentActivity = activity;
    }

    healCultists() {
        for (var i in this.slots) {
            this.slots[i].heal();
        }
    }

    instaHealCultists() {
        for (var i in this.slots) {
            this.slots[i].instaHeal();
        }
    }

    toggleAutoHeal() {
        if (this.autoHeal) {
            this.autoHeal = false;
        }
        else {
            this.autoHeal = true;
        }
    }
}