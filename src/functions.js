//pinias
import { useResourcesStore } from "./stores/resources";
import { useCultistsStore } from "./stores/cultists";
import { useExpansionsStore } from "./stores/expansions";
import { useMiscStore } from "./stores/misc";
import { useTextLogStore } from "./stores/textLog";
import { useInventoryStore } from "./stores/inventory";
//expansions
import { useMinesStore } from "./stores/mines";
//classes
import { Item } from "./classes/Item";
import { Cultist } from "./classes/Cultist";
//testing json
import items from "@/assets/items.json";


//tick system
export function tick() {
    /*const resources = useResourcesStore();
    const expansions = useExpansionsStore();
    //adding resources
    for (var i in resources.getAll) {
        switch(i) {
            case "evilness":
                calculateEvilness();
                break;
            case "slime":
                calculateSlime();
                break;
            default:
                calculateResource(i);
        }


    }

    expansions.expansionTicks();

    updateResources();

    //updating xp for cultists
    calculateXpOutput();
    updateCultistXp();

    //checking what convos need playing
    checkConvos();*/
}

//calculating evilness output, since its different from other resources
function calculateEvilness() {
    const cultists = useCultistsStore();
    const resources = useResourcesStore();

    var totalEvilnessOutput = 0;
    for (var i in cultists.regularCultists) {
        totalEvilnessOutput += cultists.regularCultists[i].getLevel();
    }

    resources.setResourcePerSec("evilness", totalEvilnessOutput);
}

//Slime is also different
function calculateSlime() {
    const cultists = useCultistsStore();
    const resources = useResourcesStore();

    var totalSlimeOutput = 0;
    for (var i in cultists.regularCultists) {
        if (cultists.regularCultists[i].getSpecies() == "Slime") {
            totalSlimeOutput += cultists.regularCultists[i].getLevel();
        }
    }

    resources.setResourcePerSec("slime", totalSlimeOutput);
}


//calculating resource output
function calculateResource(resource) {
    //first - instantiate stores
    const resources = useResourcesStore();
    const cultists = useCultistsStore();


    //second - get jobs with matching resource
    const arrayOfJobs = jobs.getByOutput(resource);

    //third - calculate output
    var totalResourceOutput = 0;

    for (var i in arrayOfJobs) {
        var resourceOutputPerBuilding = 0;
        const job = arrayOfJobs[i];
        const associatedStat = job["stat"];
        for (var j in job["baseArray"]) {
            const cultist = cultists.getCultistById(job["baseArray"][j]);
            resourceOutputPerBuilding += cultist.getStat(associatedStat);
        }
        for (var j in job["modifiers"]) {
            resourceOutputPerBuilding = Math.floor(resourceOutputPerBuilding * job["modifiers"][j].modifier());
        }
        totalResourceOutput += resourceOutputPerBuilding;
    }

    //subtracting consumed resources
    const arrayOfConsumerJobs = jobs.getByConsumes(resource);

    for (var i in arrayOfConsumerJobs) {
        var consumedAmount = arrayOfConsumerJobs[i]["consumes"][resource] * arrayOfConsumerJobs[i]["baseArray"].length;
        totalResourceOutput -= consumedAmount;
    }

    //fourth - update resources store with new output
    resources.setResourcePerSec(resource, totalResourceOutput)
}

//updating the resources
function updateResources() {
    const resources = useResourcesStore();

    for (var i in resources.getAll) {
        resources.modifyResource(i, resources.getResourcePerSec(i));
    }
}

function calculateXpOutput() {
    const cultists = useCultistsStore();
    const misc = useMiscStore();

    const arrayOfJobs = jobs.getByOutput("xp");

    var totalXpOutput = 1;

    for (var i in arrayOfJobs) {
        var xpOutputPerBuilding = 0;
        const job = arrayOfJobs[i];
        const associatedStat = job["stat"];
        for (var j in job["baseArray"]) {
            const cultist = cultists.getCultistById(job["baseArray"][j]);
            xpOutputPerBuilding += cultist.getStat(associatedStat);
        }
        for (var j in job["modifiers"]) {
            xpOutputPerBuilding = Math.floor(xpOutputPerBuilding * job["modifiers"][j].modifier());
        }
        totalXpOutput += xpOutputPerBuilding;
    }

    misc.setXpOutput(totalXpOutput);

}

//checking and playing convos
/*function checkConvos() {
    const convos = useConvosStore();

    convos.playPerRequirements();
}*/


//creating a cultist
function createCultist(id, name, species, job = null, stats = {str: 1, int: 1, agi: 1, cha: 1}, level = 1, currentXp = 0, xpNeeded = 20, xpIncrement = 1.5, freeStatPoints = 0, levelLimit = 10) {
    return new Cultist(id, name, species, job, stats, level, currentXp, xpNeeded, xpIncrement, freeStatPoints, levelLimit);
}

export function deserializeCultist(obj) {
    const cultists = useCultistsStore();

    const cultist = createCultist(obj.id, obj.name, obj.species, obj.job, obj.stats, obj.level, obj.currentXp, obj.xpNeeded, obj.xpIcrement, obj.freeStatPoints, obj.levelLimit);

    cultists.addCultist(cultist);
}

//creating new cultists
export function addCultist(species) {
    const cultists = useCultistsStore();

    var id = cultists.numOfCultists;

    while (cultists.checkIfIdUsed(id)) {
        id++;
    }

    const name = "cultist " + id;

    const cultist = createCultist(id, name, species)

    cultists.addCultist(cultist);
    
}


//adding cultists to a job
export function addCultistToJob(cultistId, jobId) {
    //first - instantiate stores
    const cultists = useCultistsStore();

    //second - add cultistId to job store
    jobs.addCultistToJob(cultistId, jobId);

    console.log(cultistId);
    console.log(jobId);

    //third - update cultist to give them job
    const cultist = cultists.getCultistById(cultistId);
    cultist.setJob(jobs.getName(jobId));
}

//refactored
export function addCultistToWorkerJob(cultistId, piniaObject) {
    const cultists = useCultistsStore();

    piniaObject.addWorker(cultistId);

    const jobName = piniaObject.getWorkerJobName;

    const cultist = cultists.getCultistById(cultistId);

    cultist.setJob(jobName);
}

export function addCultistToOverseerJob(cultistId, piniaObject) {
    const cultists = useCultistsStore();

    piniaObject.assignOverseer(cultistId);

    const jobName = piniaObject.getOverseerJobName;

    const cultist = cultists.getCultistById(cultistId);

    cultist.setJob(jobName);
}


//removing cultists from a job
export function removeCultistFromJob(cultistId) {
    const cultists = useCultistsStore();

    jobs.removeCultistFromJob(cultistId);

    const cultist = cultists.getCultistById(cultistId);
    cultist.setJob(null)
}

//refactored
export function removeCultistFromOverseerJob(piniaObject) {
    const cultists = useCultistsStore();

    const cultist = cultists.getCultistById(piniaObject.getOverseer);

    cultist.removeJob();

    piniaObject.removeOverseer();
}

export function removeCultistFromWorkerJob(cultistId, piniaObject) {
    const cultists = useCultistsStore();

    const cultist = cultists.getCultistById(cultistId);

    cultist.removeJob();

    piniaObject.removeWorker(cultistId);
}

//firing a cultist
export function fireCultist(cultistId) {
    const cultists = useCultistsStore();

    removeCultistFromJob(cultistId);

    cultists.removeCultist(cultistId);
}


//adding xp to cultists with jobs
function updateCultistXp() {
    const cultists = useCultistsStore();
    const misc = useMiscStore();

    const cultistArray = cultists.getEmployed

    for (var i in cultistArray) {
        cultistArray[i].addXp(misc.getXpOutput);
    }
}



//building expansions
export function buildExpansion(expansionId) {
    const expansions = useExpansionsStore();
    const misc = useMiscStore();

    expansions.buildExpansion(expansionId);
    misc.calculateCultistLimit();
    
}


//returns true if there is space for more cultists
export function checkCultistSpace() {
    const cultists = useCultistsStore();
    const misc = useMiscStore();

    if (cultists.numOfCultists >= misc.getCultistLimit) {
        return false;
    }
    else {
        return true;
    }
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





//localStorage functions
export function saveData() {
    //have each pinia store save their data seperately
    const cultists = useCultistsStore();
    const expansions = useExpansionsStore();
    const inventory = useInventoryStore();
    const mines = useMinesStore();
    const misc = useMiscStore();
    const resources = useResourcesStore();
    const textLog = useTextLogStore();

    cultists.saveData();
    expansions.saveData();
    //inventory.saveData();
    mines.saveData();
    misc.saveData();
    resources.saveData();
    textLog.saveData();
}

export function loadData() {
    //same as save, but this time it's the load
    const cultists = useCultistsStore();
    const expansions = useExpansionsStore();
    const inventory = useInventoryStore();
    const mines = useMinesStore();
    const misc = useMiscStore();
    const resources = useResourcesStore();
    const textLog = useTextLogStore();

    cultists.loadData();
    expansions.loadData();
    //inventory.loadData();
    mines.loadData();
    misc.loadData();
    resources.loadData();
    textLog.loadData();
}

//instantiat items
export function instantiateItems() {
    const mines = useMinesStore();

    mines.instantiateItems();
}







//HELPER FUNCTIONS
export function posToNeg(num) {
    return -Math.abs(num);
}