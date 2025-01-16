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
        const enemies = useEnemiesStore();

        const encounter = this.getRandomEncounter();

        for (var i in encounter) {
            this.currentEncounter.push(enemies.generateNewEnemy(encounter[i], this));
        }
    }

    removeEnemy(enemyId) {
        this.currentEncounter = this.currentEncounter.filter((enemy) => enemy.getId() != enemyId);
    }
}