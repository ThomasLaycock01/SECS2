export class Item {
    constructor(id, data) {
        this.id = id;

        this.itemId = data.itemId;
        this.name = data.name;
        this.shortName = data.shortName;
        this.type = data.type;
        this.modifiers = data.modifiers;
        this.sellValue = data.sellValue;
        this.tier = data.tier;
        this.effectDesc = data.effectDesc;

        this.equippedCultist = null;
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

    getEffectDesc() {
        return this.effectDesc;
    }

    getModifiers() {
        return this.modifiers;
    }

    getEquipmentModifier(typeArray) {
        var modVal = 0;

        for (var i in this.modifiers) {
            const modObj = this.modifiers[i];
            if (typeArray.includes(modObj.type) && modObj.modifier) {
                modVal += modObj.modifier;
            }
        }

        return modVal;
    }

    getEquipmentBase(stat) {
        var baseVal = 0;

        for (var i in this.modifiers) {
            const modObj = this.modifiers[i];
            if (modObj.type == stat && modObj.base) {
                baseVal += modObj.base;
            }
        }

        return baseVal;
    }

    getSellValue() {
        return this.sellValue;
    }

    getTier() {
        return this.tier;
    }

    getEquippedCultist() {
        return this.equippedCultist;
    }

    getSellAvailable() {
        return this.sellAvailable;
    }

    //actions
    equipItem(cultist) {
        this.equippedCultist = cultist;
    }

    unequipItem() {
        this.equippedCultist = null;
    }
    //gonna finish serializing later - work on mines first
    /*serialize() {
        const serializedItem = {
            id: this.id,
            itemId: this.itemId,
            name: this.name,
            shortName: this.shortName,
            type: this.type,
            modifiers: this.modifiers,
            sellValue: this.sellValue
        }

        return serializedItem;
    }*/
}