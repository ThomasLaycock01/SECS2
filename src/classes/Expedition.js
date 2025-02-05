import { useEnemiesStore } from "@/stores/barracks/enemies";
import { useExpeditionsStore } from "@/stores/barracks/expeditions";

export class Expedition {
    constructor(obj) {
        this.id = obj.id;
        this.name = obj.name;
        this.desc = obj.desc;

        this.encounters = obj.encounters;
        this.unlocked = true;

        this.activeParty = null;

        this.currentEncounter = [];
        this.encounterIndex = 0;
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

    getUnlocked() {
        return this.unlocked;
    }

    getLength() {
        return this.encounters.length;
    }

    getActiveParty() {
        return this.activeParty;
    }

    getCurrentEncounter() {
        return this.currentEncounter;
    }

    //actions
    unlock() {
        this.unlocked = true;
    }

    setActiveParty(partyObj) {
        this.activeParty = partyObj;
    }

    removeActiveParty() {
        this.activeParty = null;
    }

    generateNextEncounter() {
        const enemies = useEnemiesStore();

        const idArray = this.encounters[this.encounterIndex];

        for (var i in idArray) {
            this.currentEncounter.push(enemies.generateNewEnemy(idArray[i], this, i));
        }
    }

    addXp(amount) {
        this.activeParty.addXp(amount);
    }

    removeEnemy(enemyId) {
        this.currentEncounter = this.currentEncounter.filter((enemy) => enemy.getId() != enemyId);

        if (this.currentEncounter.length == 0) {
            this.completeEncounter();
        }
    }

    completeEncounter() {
        this.encounterIndex++;

        if (this.encounterIndex + 1 > this.encounters.length) {
            this.endExpedition(true);
        }
    }

    endExpedition(completed = false) {
        const expeditions = useExpeditionsStore();

        expeditions.unsetActiveExpedition();

        this.resetEncounterIndex();

        if (completed) {
            console.log("expedition completed!");
        }
    }

    resetEncounterIndex() {
        this.encounterIndex = 0;
    }
}