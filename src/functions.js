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
import { Cultist } from "./classes/Cultist";


//tick system
export function tick() {
    const expansions = useExpansionsStore();
    const cultists = useCultistsStore();

    cultists.tick();
    expansions.expansionTicks();/*

    //updating xp for cultists
    calculateXpOutput();
    updateCultistXp();

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


//adding cultists to a job/an overseer job
export function addCultistToWorkerJob(obj, piniaObject) {
    const cultists = useCultistsStore();

    const cultist = cultists.getCultistById(obj.id)

    piniaObject.addWorker(obj);

    const jobName = piniaObject.getWorkerJobName;

    cultist.setJob(jobName);
}

export function addCultistToOverseerJob(cultistId, piniaObject) {
    const cultists = useCultistsStore();

    piniaObject.assignOverseer(cultistId);

    const jobName = piniaObject.getOverseerJobName;

    const cultist = cultists.getCultistById(cultistId);

    cultist.setJob(jobName);
}


//removing cultists from a job/an overseer job
export function removeCultistFromOverseerJob(piniaObject) {
    const cultist = piniaObject.getOverseer;

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