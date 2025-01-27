import { useEnemiesStore } from "@/stores/barracks/enemies";

export class Area {
    constructor(obj) {
        this.id = obj.id;
        this.name = obj.name;
        this.desc = obj.desc;

        this.encounters = obj.encounters;
        this.currentEncounter = [];

        this.activeParty = null;
        this.active = false;

        this.maxLevel = 1;
        this.currentLevel = 1;
        this.levelProgress = 0;
    }

    //getters
    getId() {
        return this.id;
    }

    getName() {
        return this.name;
    }

    getDesc() {
        return this.desc;
    }

    getActive() {
        return this.active;
    }

    getActiveParty() {
        return this.activeParty;
    }

    getEncounters() {
        return this.encounters;
    }

    getRandomEncounter() {
        const randIndex = Math.floor(Math.random() * this.getEncounters().length);
        return this.encounters[randIndex];
    }

    getCurrentEncounter() {
        return this.currentEncounter;
    }

    getMaxLevel() {
        return this.maxLevel;
    }

    getCurrentLevel() {
        return this.currentLevel;
    }

    getLevelProgress() {
        return this.levelProgress
    }

    checkAtMaxLevel() {
        return this.currentLevel == this.maxLevel;
    }

    //actions
    setActiveParty(partyObj) {
        this.activeParty = partyObj;
    }

    toggleActive() {
        if (this.active) {
            this.active = false;
        }
        else {
            this.active = true;
        }
    }

    generateEncounter() {   
        this.currentEncounter = [];
        
        const enemies = useEnemiesStore();

        const encounter = this.getRandomEncounter();

        for (var i in encounter) {
            this.currentEncounter.push(enemies.generateNewEnemy(encounter[i], this, i));
        }
    }

    clearEncounter() {
        this.currentEncounter = [];
    }

    addXp(amount) {
        this.activeParty.addXp(amount);
    }

    removeEnemy(enemyId) {
        this.currentEncounter = this.currentEncounter.filter((enemy) => enemy.getId() != enemyId);

        if (this.currentEncounter.length == 0) {
            this.addLevelProgress();
        }
    }

    addLevelProgress() {
        this.levelProgress++;
        this.checkLevelUp();
    }

    checkLevelUp() {
        if (this.levelProgress >= 10) {
            this.levelProgress = 0;
            this.maxLevel++;
            //if currentLevel was at max, keep it at max
            if (this.currentLevel == this.maxLevel - 1) {
                this.increaseCurrentLevel();
            }
        }
    }

    increaseCurrentLevel() {
        this.currentLevel++;
        this.clearEncounter();
    }

    decreaseCurrentLevel() {
        this.currentLevel--;
        this.clearEncounter();
    }
}