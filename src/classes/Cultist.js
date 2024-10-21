export class Cultist {
    constructor(id, name, raceTemplate, job, level, currentXp, xpNeeded, xpIncrement, levelLimit, perks, perkPoints, equipment) {
        this.id = id;
        this.name = name;
        this.job = job;
        this.level = level;
        this.currentXp = currentXp;
        this.xpNeeded = xpNeeded;
        this.xpIncrement = xpIncrement;
        this.levelLimit = levelLimit;
        
        this.race = raceTemplate.name;
        this.racialModifier = raceTemplate.racialModifier;

        this.perks = perks;
        this.perkPoints = perkPoints;
        this.equipment = equipment;
    }

    //getters
    getName() {
        return this.name;
    }

    getJob() {
        return this.job;
    }

    getId() {
        return this.id;
    }

    getXp() {
        return this.currentXp;
    }

    getXpNeeded() {
        return this.xpNeeded;
    }

    getXpIncrement() {
        return this.xpIncrement;
    }

    getLevel() {
        return this.level;
    }

    getLevelLimit() {
        return this.levelLimit;
    }

    getRace() {
        return this.race;
    }

    getEquipment() {
        return this.equipment;
    }

    getPerks() {
        return this.perks;
    }

    getPerkPoints() {
        return this.perkPoints;
    }

    checkIfHasPerk(perkId) {
        for (var i in this.getPerks()) {
            if (this.getPerks()[i].perkId == perkId) {
                return true;
            }
        }

        return false;
    }

    checkIfEquipped(type) {
        if (this.equipment[type] != null) {
            return true;
        }
        return false;
    }

    //setters
    setJob(job) {
        this.job = job;
    }

    removeJob() {
        this.job = null;
    }

    addXp(amount) {
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
        this.incrementPerkPoint();
    }

    incrementPerkPoint() {
        this.perkPoints++;
    }

    decrementPerkPoint() {
        this.perkPoints--;
    }

    setLevelLimit() {
        const cultists = useCultistsStore();
        this.levelLimit = cultists.getDefaultLevelLimit;
    }

    equipItem(item) {
        const type = item.getType();

        if (this.checkIfEquipped(type)) {
            this.unequipItem(type);
        }

        this.equipment[type] = item;
        item.equipItem(this.getId());
    }

    unequipItem(type) {
        this.equipment[type].unequipItem();
        this.equipment[type] = null;
    }

    addPerk(perkObject) {
        this.perks.push(perkObject);
        this.decrementPerkPoint();
    }

    getLevelModifier(levelMod) {
        return (this.getLevel() - 1) * levelMod;
    }

    getModifiers(type, altType = null, levelMod = 0) {
        var modVal = 0;

        for (var i in this.getEquipment()) {
            if (this.getEquipment()[i]) {
                for (var j in this.getEquipment()[i].getModifiersByType(type, altType)) {
                    modVal += this.getEquipment()[i].getModifiersByType(type, altType)[j]["modifier"];
                }
            }
        }
        
        for (var i in this.getPerks()) {
            for (var j in this.getPerks()[i]["modifiers"]) {
                if (this.getPerks()[i]["modifiers"][j]["type"] == type || this.getPerks()[i]["modifiers"][j]["type"] == "global") {
                    if (altType) {
                        if (this.getPerks()[i]["modifiers"][j]["altType"] == altType || !this.getPerks()[i]["modifiers"][j]["altType"]) {
                            modVal += this.getPerks()[i]["modifiers"][j]["modifier"];
                        }
                    }
                    else {
                        if (!this.getPerks()[i]["modifiers"][j]["altType"]) {
                            modVal += this.getPerks()[i]["modifiers"][j]["modifier"];
                        }
                    }
                }
            }
        }
        
        //adding the levelMod
        if (levelMod) {
            modVal += this.getLevelModifier(levelMod);
        }

        return modVal;
    }

    /*serialize() {
        const serializedCultist = {
            id: this.id,
            name: this.name,
            job: this.job,
            level: this.level,
            currentXp: this.currentXp,
            xpNeeded: this.xpNeeded,
            xpIncrement: this.xpIncrement,
            levelLimit: this.levelLimit,
            species: this.species
        }

        return serializedCultist;
    }*/
}