//pinias
import { useResourcesStore } from "./stores/globalPinias/resources";
import { useCultistsStore } from "./stores/globalPinias/cultists";
import { useInventoryStore } from "./stores/globalPinias/inventory";
import { useBuildingsStore } from "./stores/globalPinias/buildings";

import { useExpansionsStore } from "./stores/globalPinias/expansions";

import { useExploreStore } from "./stores/barracks/explore";
import { useExpeditionsStore } from "./stores/barracks/expeditions";
import { usePartiesStore } from "./stores/barracks/parties";
import { useEnemiesStore } from "./stores/barracks/enemies";
import { useTextLogStore } from "./stores/misc/textLog";
//classes
import { Cultist } from "./classes/Cultist";

import { useTooltipsStore } from "./stores/misc/tooltips";


//tick system
export function tick() {
    const expansions = useExpansionsStore();
    const cultists = useCultistsStore();
    const explore = useExploreStore();
    const expeditions = useExpeditionsStore();
    const parties = usePartiesStore();
    const resources = useResourcesStore();

    expansions.expansionTicks();
    cultists.tick();
    explore.tick();
    expeditions.tick();
    parties.tick();

    resources.updateResources();
}


//creating the stats object needed to create a cultist
export function createStatsObj(statTemplate) {
    const returnObj = {};

    for (var i in statTemplate) {
        returnObj[i] = Math.round(Math.random() * (statTemplate[i].max - statTemplate[i].min) + statTemplate[i].min);
    }

    return returnObj;
}

export function createLevelUpObj(raceId) {
    const cultists = useCultistsStore();

    const template = cultists.getRaceLevelUp(raceId);

    const returnObj = {};

    for (var i in template) {
        returnObj[i] = Math.round(Math.random() * (template[i].max - template[i].min) + template[i].min);
    }

    return returnObj;
}

//creating a cultist
function createCultist(id, name, raceTemplate) {
    return new Cultist(id, name, raceTemplate);
}

/*export function deserializeCultist(obj) {
    const cultists = useCultistsStore();

    const cultist = createCultist(obj.id, obj.name, obj.species, obj.job, obj.level, obj.currentXp, obj.xpNeeded, obj.xpIcrement, obj.levelLimit);

    cultists.addCultist(cultist);
}*/

//creating new cultists
export function addCultist(race) {
    const cultists = useCultistsStore();

    var id = cultists.getNumOfCultists.toString();

    while (cultists.checkIfIdUsed(id)) {
        id++;
    }

    const name = "cultist " + id;

    const raceTemplate = cultists.getRaceTemplate(race);

    const cultist = createCultist(id, name, raceTemplate)

    cultists.addCultist(cultist);
    
}

//adding cultists to a job
export function addCultistToJob(piniaObject, jobId, cultist) {
    
    //check if job is full, and return if it is - this shouldn't be necessary, but just in case
    if (piniaObject.getJobArray(jobId).length == piniaObject.getJobLimit(jobId)) {
        return;
    }

    piniaObject.addToJob(jobId, cultist);

}

//removing cultists from a job
export function removeCultistFromJob(piniaObject, jobId, cultist) {   

    cultist.removeJob();

    piniaObject.removeFromJob(jobId, cultist);
}



//firing a cultist
export function fireCultist(cultistId) {
    const cultists = useCultistsStore();

    removeCultistFromJob(cultistId);

    cultists.removeCultist(cultistId);
}


//selling an item
export function sellItem(id) {
    const inventory = useInventoryStore();
    const resources = useResourcesStore();

    const item = inventory.getItemById(id);
    resources.modifyResource("gold", item.getSellValue());
    inventory.removeItem(item.id);
}

export function deserializeItem(object) {
    const inventory = useInventoryStore();

    inventory.addItemFromDeserialize(object);
}




//checking buttons for rendering
export function buttonCheck(actionObject) {
    for (var i in actionObject.buttons) {
        if (actionObject.buttons[i].showCondition()) {
            return true;
        }
    }
    return false;
}



//fetching modifiers that affect all cultists
export function getGlobalModifiers(typeArray) {
    var modVal = 0;

    //buildings
    const buildings = useBuildingsStore();

    modVal += buildings.getBuildingModifier(typeArray);

    return modVal;
}


//function executing a round of combat
export function combatRound(area) {
    const party = area.getActiveParty().getSlots();
    const enemies = area.getCurrentEncounter();

    //party
    for (var i in party) {
        //skip if no enemies OR all party members are knocked out
        if (area.getCurrentEncounter().length < 1 || area.getActiveParty().checkFullKnockOut()) {
            break;
        }
        //skip this slot if the cultis is knocked out
        if (party[i].getKnockedOut()) {
            continue;
        }


        //find a target
        var target = null;

        for (var j in enemies) {
            if (!target && enemies[j].getCurrentHP() > 0) {
                target = enemies[j];
            }
        }

        const cultist = party[i];

        const physDmg = cultist.getAtkValue("phys");
        const magDmg = cultist.getAtkValue("mag");
        
        if (target != null) {
            target.takeDamage(physDmg, magDmg);
        }
    }

    //enemies
    for (var i in enemies) {
        const enemy = enemies[i];

        const physDmg = enemy.getAtkValue("phys");
        const magDmg = enemy.getAtkValue("mag");

        //finding a target
        var target = null;
        for (var j in party) {
            if (target || party[j].getKnockedOut()) {
                continue;
            }
            else {
                target = party[j];
            }

        }

        if (target != null) {
            target.takeDamage(physDmg, magDmg);
        }
    }
}


//tooltip - takes element that needs tooltip appending + tooltip data
export function tooltip(e, data) {
    const tooltips = useTooltipsStore();
    const target = e.target;

    const centerPoint = target.getBoundingClientRect().width / 2;
    const relativeCenterPoint = target.getBoundingClientRect().left + centerPoint;

    const bottom = e.target.getBoundingClientRect().bottom;
    
    //-125 for the width of the tooltip
    tooltips.showTooltip(bottom, relativeCenterPoint - 125, data);
}


//load function
export function instantiateGame() {
    const cultists = useCultistsStore();
    const expeditions = useExpeditionsStore();
    const explore = useExploreStore();
    const parties = usePartiesStore();
    const enemies = useEnemiesStore();
    const textLog = useTextLogStore();
    const inventory = useInventoryStore();
    const buildings = useBuildingsStore();

    cultists.instantiateRaces();
    buildings.instantiateBuildings();
    parties.instantiateRoles();
    explore.instantiateAreas();
    expeditions.instantiateExpeditions();
    enemies.instantiateEnemies();
    textLog.instantiateMessages();
    inventory.instantiateItems();

}






//HELPER FUNCTIONS
export function posToNeg(num) {
    return -Math.abs(num);
}