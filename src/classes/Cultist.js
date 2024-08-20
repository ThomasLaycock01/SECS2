export class Cultist {
    constructor(id, name, species, job, level, currentXp, xpNeeded, xpIncrement, levelLimit, modifiers, perks, equipment) {
        this.id = id;
        this.name = name;
        this.job = job;
        this.level = level;
        this.currentXp = currentXp;
        this.xpNeeded = xpNeeded;
        this.xpIncrement = xpIncrement;
        this.levelLimit = levelLimit;
        this.species = species;

        this.modifiers = modifiers;
        this.perks = perks;
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

    getModifiers() {
        return this.modifiers;
    }

    getEquipment() {
        return this.equipment;
    }

    getPerks() {
        return this.perks;
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
    }

    setLevelLimit() {
        const misc = useMiscStore();
        this.levelLimit = misc.getDefaultLevelLimit;
    }

    calculateModifiers() {
        for (var i in this.getPerks()) {
            this.modifiers.push(this.getPerks()[i].modifier);
        }
        for (var i in this.getEquipment()) {
            this.modifiers.push(this.getEquipment()[i].modifier);
        }
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