export class Cultist {
    constructor(id, name, species, job, stats, level, currentXp, xpNeeded, xpIncrement, freeStatPoints, levelLimit) {
        this.id = id;
        this.name = name;
        this.job = job;
        this.stats = stats;
        this.level = level;
        this.currentXp = currentXp;
        this.xpNeeded = xpNeeded;
        this.xpIncrement = xpIncrement;
        this.freeStatPoints = freeStatPoints;
        this.levelLimit = levelLimit;
        this.species = species;
    }

    //getters
    getName() {
        return this.name;
    }

    getJob() {
        return this.job;
    }

    getStats() {
        return this.stats;
    }

    getStat(stat) {
        return this.stats[stat];
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

    getFreeStatPoints() {
        return this.freeStatPoints;
    }

    getLevelLimit() {
        return this.levelLimit;
    }

    getSpecies() {
        return this.species;
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
        this.freeStatPoints += Math.ceil(Math.random() * 3)
    }

    increaseStat(stat) {
        this.freeStatPoints -= 1;
        this.stats[stat] += 1;
    }

    setLevelLimit() {
        const misc = useMiscStore();
        this.levelLimit = misc.getDefaultLevelLimit;
    }

    serialize() {
        const serializedCultist = {
            id: this.id,
            name: this.name,
            job: this.job,
            stats: this.stats,
            level: this.level,
            currentXp: this.currentXp,
            xpNeeded: this.xpNeeded,
            xpIncrement: this.xpIncrement,
            freeStatPoints: this.freeStatPoints,
            levelLimit: this.levelLimit,
            species: this.species
        }

        return serializedCultist;
    }
}