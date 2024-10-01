export class Item {
    constructor(id, data) {
        this.id = id;

        this.itemId = data.itemId;
        this.name = data.name;
        this.shortName = data.shortName;
        this.type = data.type;
        this.modifiers = data.modifiers;
        this.sellPrice = data.sellPrice;
        this.tier = data.tier;

        this.equippedCultistId = null;
    }

    //getters
    getId() {
        return this.id;
    }

    getItemId() {
        return this.itemId;
    }

    getName() {
        return this.name;
    }

    getShortName() {
        return this.shortName;
    }

    getType() {
        return this.type;
    }

    getModifiers() {
        return this.modifiers;
    }

    getModifiersByJob(job, type) {
        const returnArray = [];
        for (var i in this.getModifiers()) {
            if (this.getModifiers()[i].job == job && this.getModifiers()[i].type == type) {
                returnArray.push(this.modifiers[i]);
            }
        }
        return returnArray;
    }

    getSellPrice() {
        return this.sellPrice;
    }

    getTier() {
        return this.tier;
    }

    getEquippedCultistId() {
        return this.equippedCultistId;
    }

    //actions
    equipItem(cultistId) {
        this.equippedCultistId = cultistId;
    }

    unequipItem() {
        this.equippedCultistId = null;
    }

    //gonna finish serializing later - work on mines first
    serialize() {
        const serializedItem = {
            id: this.id,
            itemId: this.itemId,
            name: this.name,
            shortName: this.shortName,
            type: this.type,
            modifiers: this.modifiers,
            sellPrice: this.sellPrice
        }

        return serializedItem;
    }
}