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

        this.equippedCultistId = null;

        this.sellAvailable = true;

        //living items may not stick around...
        if (data.isLiving) {
            this.isLiving = true;
            this.currentXp = 0;
            this.level = 1;
            this.xpNeeded = data.isLiving.xpNeeded;
            this.xpIncrement = data.isLiving.xpIncrement;
            this.levelLimit = data.isLiving.levelLimit;
            this.livingDesc = data.isLiving.livingDesc;
        }
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
            if (typeArray.includes(modObj.type)) {
                modVal += modObj.modifier;
            }
        }

        return modVal;
    }

    getSellValue() {
        return this.sellValue;
    }

    getTier() {
        return this.tier;
    }

    getEquippedCultistId() {
        return this.equippedCultistId;
    }

    getSellAvailable() {
        return this.sellAvailable;
    }

    //isLiving getters
    getIsLiving() {
        return this.isLiving;
    }

    getCurrentXp() {
        if (this.isLiving) {
            return this.currentXp;
        }
        console.log("isLiving function called on non living item");
    }

    getXpNeeded() {
        if (this.isLiving) {
            return this.xpNeeded;
        }
        console.log("isLiving function called on non living item");
    }

    getXpIncrement() {
        if (this.isLiving) {
            return this.xpIncrement;
        }
        console.log("isLiving function called on non living item");
    }

    getLevel() {
        if (this.isLiving) {
            return this.level;
        }
        console.log("isLiving function called on non living item");
    }

    getLevelLimit() {
        if (this.isLiving) {
            return this.levelLimit;
        }
        console.log("isLiving function called on non living item");
    }

    getLivingDesc() {
        if (this.isLiving) {
            return this.livingDesc;
        }
        console.log("isLiving function called on non living item");
    }

    //actions
    equipItem(cultistId) {
        this.equippedCultistId = cultistId;
        this.toggleSellAvailable();
    }

    unequipItem() {
        this.equippedCultistId = null;
        this.toggleSellAvailable();
    }

    toggleSellAvailable() {
        if (this.sellAvailable) {
            this.sellAvailable = false;
        }
        else {
            this.sellAvailable = true;
        }
    }

    //isLiving actions
    addXp(amount) {
        if (!this.getIsLiving()) {
            console.log("error - called addXP on non-living object");
            return;
        }

        if (this.level == this.levelLimit) {
            this.currentXp = 0;
        }
        else {
            this.currentXp += amount;
            this.checkLevelUp();
        }
    }

    checkLevelUp() {
        if (this.currentXp >= this.xpNeeded && !(this.level + 1 > this.levelLimit)) {
            this.levelUp();
        }
    }

    levelUp() {
        this.currentXp = this.currentXp - this.xpNeeded;
        this.xpNeeded = Math.floor(this.xpNeeded * this.xpIncrement);

        this.level += 1;
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