export class Item {
    constructor(id, data) {
        this.id = id;

        this.itemId = data.itemId;
        this.name = data.name;
        this.shortName = data.shortName;
        this.type = data.type;
        this.modifiers = data.modifiers;
        this.sellPrice = data.sellPrice;
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

    //actions
    serialize() {
        const serializedItem = {
            stackId: this.stackId,
            itemId: this.itemId,
            amount: this.amount
        }

        return serializedItem;
    }
}