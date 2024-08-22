export class Item {
    constructor(id, data) {
        this.id = id;

        this.itemId = data.itemId;
        this.name = data.name;
        this.shortName = data.shortName;
        this.type = data.type;
        this.modifiers = data.modifiers;
        this.sellPrice = data.sellPrice;
        this.equipped = false;
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

    getModifiersByType(type) {
        const returnArray = [];
        for (var i in this.modifiers) {
            if (this.modifiers[i].type == type) {
                returnArray.push(this.modifiers[i]);
            }
        }
        return returnArray;
    }

    getSellPrice() {
        return this.sellPrice;
    }

    getEquipped() {
        return this.equipped;
    }

    //actions
    toggleEquipped() {
        if (this.equipped) {
            this.equipped = false;
            return;
        }
        this.equipped = true;
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