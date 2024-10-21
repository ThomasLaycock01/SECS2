//pinias
import { useResourcesStore } from "./stores/globalPinias/resources";
import { useCultistsStore } from "./stores/globalPinias/cultists";
import { useInventoryStore } from "./stores/globalPinias/inventory";
import { useBuildingsStore } from "./stores/globalPinias/buildings";

import { useLairStore } from "./stores/lair";
import { useExpansionsStore } from "./stores/expansions";
//expansions
import { useMinesStore } from "./stores/mines";
import { useForgeStore } from "./stores/forge";
//classes
import { Cultist } from "./classes/Cultist";


//tick system
export function tick() {
    const expansions = useExpansionsStore();
    const cultists = useCultistsStore();

    cultists.tick();
    expansions.expansionTicks();/*

    //checking what convos need playing
    checkConvos();*/
}

//checking and playing convos
/*function checkConvos() {
    const convos = useConvosStore();

    convos.playPerRequirements();
}*/


//creating a cultist
function createCultist(id, name, species, job = null, level = 1, currentXp = 0, xpNeeded = 20, xpIncrement = 1.5, levelLimit = 10, perks = [], perkPoints = 0, equipment = {tool: null, body: null, accessory: null}) {
    return new Cultist(id, name, species, job, level, currentXp, xpNeeded, xpIncrement, levelLimit, perks, perkPoints, equipment);
}

export function deserializeCultist(obj) {
    const cultists = useCultistsStore();

    const cultist = createCultist(obj.id, obj.name, obj.species, obj.job, obj.level, obj.currentXp, obj.xpNeeded, obj.xpIcrement, obj.levelLimit);

    cultists.addCultist(cultist);
}

//creating new cultists
export function addCultist(race) {
    const cultists = useCultistsStore();

    var id = cultists.numOfCultists;

    while (cultists.checkIfIdUsed(id)) {
        id++;
    }

    const name = "cultist " + id;

    const raceTemplate = cultists.getRaceTemplate(race);

    console.log(raceTemplate);

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
export function removeCultistFromJob(piniaObject, jobId, cultistId = null) {    
    if (cultistId) {
        const cultists = useCultistsStore();
        const cultist = cultists.getCultistById(cultistId);
        cultist.removeJob();
    }
    
    piniaObject.removeFromJob(jobId, cultistId);
}






export function addCultistToOtherJob(cultistId, piniaObject, jobId) {
    const cultists = useCultistsStore();

    const jobName = piniaObject.assignOther(cultistId, jobId);

    const cultist = cultists.getCultistById(cultistId);

    cultist.setJob(jobName);
}

export function removeCultistFromOtherJob(piniaObject, jobId, cultistId, isJobUnique = true) {
    const cultists = useCultistsStore();


    if (isJobUnique) {
        piniaObject.removeOther(jobId);
        const cultist = cultists.getCultistById(cultistId);
        cultist.removeJob();
    }
    else {
        piniaObject.removeOther(jobId, cultistId);
        const cultist = cultists.getCultistById(cultistId);
        cultist.removeJob();
    }
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
    resources.modifyResource("gold", item.getSellPrice());
    inventory.removeItem(item.id);
}

export function deserializeItem(object) {
    const inventory = useInventoryStore();

    inventory.addItemFromDeserialize(object);
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