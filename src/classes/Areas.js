import { useEnemiesStore } from "@/stores/barracks/enemies";
import { useExpeditionsStore } from "@/stores/barracks/expeditions";
import { useModalsStore } from "@/stores/misc/modal";
import { useTooltipsStore } from "@/stores/misc/tooltips";

export class Area {
    constructor(obj) {
        this.id = obj.id;
        this.name = obj.name;
        this.desc = obj.desc;
        this.activityName = obj.activityName;

        this.encounters = obj.encounters;
        this.currentEncounter = [];

        this.expeditions = obj.expeditions;

        this.activeParty = null;
        this.active = false;
        this.autoEmbark = false;

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

    getAutoEmbark() {
        return this.autoEmbark;
    }

    getEncounters() {
        return this.encounters;
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

    getExpeditions() {
        return this.expeditions;
    }

    getActivityName() {
        return this.activityName;
    }

    //actions
    setActiveParty(partyObj) {
        this.activeParty = partyObj;
    }

    removeActiveParty() {
        this.activeParty = null;
    }

    toggleActive(click = false) {
        if (this.active) {
            this.active = false;
            this.activeParty.setCurrentActivity();
            if (click) {
                this.autoEmbark = false;
            }
        }
        else {
            this.active = true;
            this.activeParty.setCurrentActivity(this.activityName);
        }
    }

    toggleAutoEmbark() {
        if (this.autoEmbark) {
            this.autoEmbark = false;
        }
        else {
            this.autoEmbark = true;
        }
    }

    checkAutoEmbark() {
        //slightly weird, but need to make sure party/party select modal isnt open when the area embarks, otherwise could change party after embark
        const modals = useModalsStore();
        const tooltips = useTooltipsStore();

        if (this.autoEmbark && this.activeParty && this.activeParty.checkFullHealth() && !(modals.checkModal("partySelect") || modals.checkModal("party"))) {
            this.toggleActive();
            //weird one, but since a mouseleave is not triggered when autoembark happens, this can bug tooltips and cause them to show when they souldnt
            tooltips.removeActiveTooltip();
        }
    }

    getValidEncounters() {
        const returnArray = [];

        for (var i in this.encounters) {
            const encounter = this.encounters[i];
            if (this.currentLevel >= encounter.minLvl && this.currentLevel <= encounter.maxLvl) {
                returnArray.push(encounter.array);
            }
        }

        return returnArray;
    }

    getRandomEncounter() {
        const validEncounters = this.getValidEncounters();

        const randIndex = Math.floor(Math.random() * validEncounters.length);
        return validEncounters[randIndex];
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

    completeEncounter() {
        this.expeditionCheck();
        if (this.currentLevel == this.maxLevel && this.maxLevel < 20) {
            this.addLevelProgress();
        }
    }

    expeditionCheck() {
        const expeditions = useExpeditionsStore();

        for (var i in this.expeditions) {
            const expedition = this.expeditions[i];

            if (this.currentLevel >= expedition.unlockLevel) {
                expeditions.unlockExpedition(expedition.id);
            }
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