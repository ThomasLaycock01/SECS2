export class Cultist {
    constructor(id, name, species, job, level, currentXp, xpNeeded, xpIncrement, levelLimit, perks, perkPoints, equipment) {
        this.id = id;
        this.name = name;
        this.job = job;
        this.level = level;
        this.currentXp = currentXp;
        this.xpNeeded = xpNeeded;
        this.xpIncrement = xpIncrement;
        this.levelLimit = levelLimit;
        this.species = species;

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

    getSpecies() {
        return this.species;
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
        this.currentXp = 0;
        this.xpNeeded = Math.floor(this.xpNeeded * this.xpIncrement);

        this.level += 1;
        this.perkPoints += 1;
    }

    incrementPerkPoint() {
        this.perkPoints++;
    }

    decrementPerkPoint() {
        this.perkPoints--;
    }

    setLevelLimit() {
        const misc = useMiscStore();
        this.levelLimit = misc.getDefaultLevelLimit;
    }

    equipItem(item) {
        const type = item.getType();
        this.equipment[type] = item;
        item.toggleEquipped();
    }

    addPerk(perkObject) {
        this.perks.push(perkObject);
        this.decrementPerkPoint();
    }

    getLevelModifier() {
        return (this.getLevel() - 1) * 0.1
    }

    getModifiersByType(type) {
        var modValue = 0;
        for (var i in this.getEquipment()) {
            if (this.getEquipment()[i]) {
                for (var j in this.getEquipment()[i].getModifiersByType(type)) {
                    modValue += this.getEquipment()[i].getModifiersByType(type)[j]["modifier"];
                }
            }
        }

        for (var i in this.getPerks()) {
            for (var j in this.getPerks()[i]["modifiers"]) {
                if (this.getPerks()[i]["modifiers"][j]["type"] == type) {
                    modValue += this.getPerks()[i]["modifiers"][j]["modifier"];
                }
            }
        }

        //this can be used later to set a cultists base output
        var totalMod = 1

        totalMod += modValue;
        //adding the levelMod for convenience
        totalMod += this.getLevelModifier();

        return totalMod;
    }

    serialize() {
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
    }
}