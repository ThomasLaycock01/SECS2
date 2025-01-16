//pinias
import { useResourcesStore } from "./stores/globalPinias/resources";
import { useCultistsStore } from "./stores/globalPinias/cultists";
import { useInventoryStore } from "./stores/globalPinias/inventory";
import { useBuildingsStore } from "./stores/globalPinias/buildings";

import { useLairStore } from "./stores/lair";
import { useExpansionsStore } from "./stores/globalPinias/expansions";
import { useTotemsStore } from "./stores/mines/totems";

import { useExploreStore } from "./stores/barracks/explore";
//expansions
import { useMinesStore } from "./stores/mines/mines";
import { useForgeStore } from "./stores/mines/forge";
//classes
import { Cultist } from "./classes/Cultist";


//tick system
export function tick() {
    const expansions = useExpansionsStore();
    const cultists = useCultistsStore();
    const explore = useExploreStore();

    expansions.expansionTicks();
    cultists.tick();
    explore.tick();
}

//checking and playing convos
/*function checkConvos() {
    const convos = useConvosStore();

    convos.playPerRequirements();
}*/



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

    var id = cultists.numOfCultists;

    while (cultists.checkIfIdUsed(id)) {
        id++;
    }

    const name = "cultist " + id;

    const raceTemplate = cultists.getRaceTemplate(race);

    const cultist = createCultist(id, name, raceTemplate)

    cultists.addCultist(cultist);
    
}


//for summoned cultists
export function beginSummoning() {
    const cultists = useCultistsStore();


    cultists.addSummoning();

    //NOTE TO SELF
    //The cultist being summoned is stored in whichever pinia is summoning it
}

export function endSummoning(species) {
    const cultists = useCultistsStore();

    cultists.removeSummoning();

    addCultist(species);
}

//adding cultists to a job
export function addCultistToJob(piniaObject, jobId, cultistId = null, cultistObj = null) {
    
    //check if job is full, and return if it is
    if (piniaObject.getJobArray(jobId).length == piniaObject.getJobLimit(jobId)) {
        return;
    }


    const cultists = useCultistsStore();

    if (cultistId != null) {
        const cultist = cultists.getCultistById(cultistId);
        cultist.setJob(piniaObject.getJobName(jobId));
    }
    else if (cultistObj) {
        const cultist = cultists.getCultistById(cultistObj.cultistId);
        cultist.setJob(piniaObject.getJobName(jobId));
    }
    else {
        console.log("error in addToJob - needs either obj or cultistId");
        return;
    }

    piniaObject.addToJob(jobId, cultistId, cultistObj);

}

//removing cultists from a job
export function removeCultistFromJob(piniaObject, jobId, cultistId) {   
     
    const cultists = useCultistsStore();
    const cultist = cultists.getCultistById(cultistId);
    cultist.removeJob();

    piniaObject.removeFromJob(jobId, cultistId);
}



//firing a cultist
export function fireCultist(cultistId) {
    const cultists = useCultistsStore();

    removeCultistFromJob(cultistId);

    cultists.removeCultist(cultistId);
}



//building expansions
export function buildExpansion(expansionId) {
    const expansions = useExpansionsStore();

    expansions.buildExpansion(expansionId);
    
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
export function getAllCultistModifiers(type, altType) {
    var returnArray = [];

    //buildings
    const buildings = useBuildingsStore();

    const buildingArray = buildings.getBuildingModifier(type, altType);

    returnArray = returnArray.concat(buildingArray);

    //totems
    const totems = useTotemsStore();

    const totemsArray = totems.getTotemModifiers(type, altType);

    returnArray = returnArray.concat(totemsArray);

    return returnArray;
}



//function executing a round of combat
export function combatRound(area) {
    const party = area.getActiveParty().getSlots();
    const enemies = area.getCurrentEncounter();

    //party
    for (var i in party) {
        if (!party[i].cultist) {
            continue;
        }

        const cultist = party[i].cultist;
        const role = party[i].role;

        const physDmg = cultist.getStat("atk") * role.getDmgGiven("phys");
        const magDmg = cultist.getStat("atk") * role.getDmgGiven("mag");

        var speedCount = 0;
        while (speedCount < cultist.getStat("spd")) {
            console.log(`${cultist.getName()} Attacks for ${physDmg} physical and ${magDmg} magical damage!`);
            enemies[0].takeDamage(physDmg, magDmg)
            speedCount++;
        }
    }

    //enemies
    for (var i in enemies) {
        const enemy = enemies[i];

        const physDmg = enemy.getStat("atk") * enemy.getDmgGiven("phys");
        const magDmg = enemy.getStat("atk") * enemy.getDmgGiven("mag");

        var speedCount = 0;
        while (speedCount < enemy.getStat("spd")) {
            console.log(`${enemies[i].getName()} Attacks for ${physDmg} physical and ${magDmg} magical damage!`);
            speedCount++;
        }
    }
}



//instantiat files
export function instantiateItems() {
    const mines = useMinesStore();
    const forge = useForgeStore();

    mines.instantiateItems();
    forge.instantiateItems();
}

export function instantiateBuildings() {
    const buildings = useBuildingsStore();
    const lair = useLairStore();
    const mines = useMinesStore();

    buildings.instantiateBuildings();
    lair.instantiateBuildings();
    mines.instantiateBuildings();
}

//function for creating a resource object on page load
export function instantiateResource(resourceObj) {

    const returnObj = {
        id: resourceObj.id,
        name: resourceObj.name,
        total: 0,
        perSec: 0,
        properties: resourceObj.properties
    };

    return returnObj;
}

export function instantiateResources() {
    const resources = useResourcesStore();

    resources.instantiateResources();
}






//HELPER FUNCTIONS
export function posToNeg(num) {
    return -Math.abs(num);
}