//pinias
import { useResourcesStore } from "./stores/globalPinias/resources";
import { useCultistsStore } from "./stores/globalPinias/cultists";
import { useInventoryStore } from "./stores/globalPinias/inventory";
import { useBuildingsStore } from "./stores/globalPinias/buildings";

import { useExpansionsStore } from "./stores/globalPinias/expansions";

import { useExploreStore } from "./stores/barracks/explore";
import { useExpeditionsStore } from "./stores/barracks/expeditions";
import { usePartiesStore } from "./stores/barracks/parties";
//expansions
import { useMinesStore } from "./stores/mines/mines";
//classes
import { Cultist } from "./classes/Cultist";


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
        returnObj[i] = Math.floor(Math.random() * (statTemplate[i].max - statTemplate[i].min) + statTemplate[i].min);
    }

    return returnObj;
}

//creating a cultist
function createCultist(id, name, species, job = null, level = 1, currentXp = 0, xpNeeded = 20, xpIncrement = 1.5, levelLimit = 10, perks = [], perkPoints = 0, equipment = {tool: null, body: null, accessory: null}) {
    return new Cultist(id, name, species, job, level, currentXp, xpNeeded, xpIncrement, levelLimit, perks, perkPoints, equipment);
}

/*export function deserializeCultist(obj) {
    const cultists = useCultistsStore();

    const cultist = createCultist(obj.id, obj.name, obj.species, obj.job, obj.level, obj.currentXp, obj.xpNeeded, obj.xpIcrement, obj.levelLimit);

    cultists.addCultist(cultist);
}*/

//creating new cultists
export function addCultist(race) {
    const cultists = useCultistsStore();

    var id = cultists.getNumOfCultists;

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
    var speedCount = 0;

    //first - find highest speed
    var highestSpeed = 0;

    for (var i in party) {
        if (!party[i].cultist) {
            continue;
        }

        if (party[i].cultist.getStat("spd") > highestSpeed) {
            highestSpeed = party[i].cultist.getStat("spd");
        }
    }

    for (var i in enemies) {
        if (enemies[i].getStat("spd") > highestSpeed) {
            highestSpeed = enemies[i].getStat("spd");
        }
    }

    //actual combat
    while (speedCount < highestSpeed) {
        //party
        for (var i in party) {
            //skip if no enemies OR all party members are knocked out
            if (area.getCurrentEncounter().length < 1 || area.getActiveParty().checkFullKnockOut()) {
                break;
            }
            //skip this slot if theres no cultist, they're knocked out, or the current speed count is higher than their speed
            if (!party[i].cultist || party[i].cultist.getKnockedOut() || party[i].cultist.getStat("spd") - 1 < speedCount) {
                continue;
            }

            const cultist = party[i].cultist;
            const role = party[i].role;

            const physDmg = cultist.getStat("atk") * role.getDmgGiven("phys");
            const magDmg = cultist.getStat("atk") * role.getDmgGiven("mag");
            
            
            enemies[0].takeDamage(physDmg, magDmg);
        }

        //same as above, but skips enemy calculations if theyre all dead
        if (area.getCurrentEncounter().length < 1 || area.getActiveParty().checkFullKnockOut()) {
            break;
        }

        //enemies
        for (var i in enemies) {
            const enemy = enemies[i];

            //skip this enemy if their speed count is too low
            if (enemy.getStat("spd") - 1 < speedCount) {
                continue;
            }

            const physDmg = enemy.getStat("atk") * enemy.getDmgGiven("phys");
            const magDmg = enemy.getStat("atk") * enemy.getDmgGiven("mag");

            //finding a target
            var target = null;
            var role = null;
            for (var j in party) {
                if (party[j].cultist == null || target || party[j].cultist.getKnockedOut()) {
                    continue;
                }
                else {
                    target = party[j].cultist;
                    role = party[j].role;
                }

            }

            if (target != null) {
                target.takeDamage(physDmg, magDmg, role);
            }
        }
        speedCount++;
    }
}



//instantiat files
export function instantiateItems() {
    const mines = useMinesStore();

    mines.instantiateItems();
}

export function instantiateBuildings() {
    const buildings = useBuildingsStore();
    const mines = useMinesStore();

    buildings.instantiateBuildings();
    mines.instantiateBuildings();
}






//HELPER FUNCTIONS
export function posToNeg(num) {
    return -Math.abs(num);
}