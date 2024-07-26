import { useResourcesStore } from "./stores/resources";
import { useCultistsStore } from "./stores/cultists";
import { useJobsStore } from "./stores/jobs";
import { useExpansionsStore } from "./stores/expansions";
import { useMiscStore } from "./stores/misc";
import { useBuildingsStore } from "./stores/buildings";
import { useCostsStore } from "./stores/costs";
import { useConvosStore } from "./stores/convos";
import { useTextLogStore } from "./stores/textLog";


//tick system
export function tick() {
    const resources = useResourcesStore();
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

    updateResources();

    //updating xp for cultists
    calculateXpOutput();
    updateCultistXp();

    //checking what convos need playing
    checkConvos();
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
    const jobs = useJobsStore();
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
    const jobs = useJobsStore();
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
function checkConvos() {
    const convos = useConvosStore();

    convos.playPerRequirements();
}



//class for creating cultists - will need expanding
class Cultist {
    constructor(id, name, species, job, stats, level, currentXp, xpNeeded, xpIncrement, freeStatPoints, levelLimit) {
        this.id = id;
        this.name = name;
        this.job = job;
        this.stats = stats;
        this.level = level;
        this.currentXp = currentXp;
        this.xpNeeded = xpNeeded;
        this.xpIncrement = xpIncrement;
        this.freeStatPoints = freeStatPoints;
        this.levelLimit = levelLimit;
        this.species = species;
    }

    //getters
    getName() {
        return this.name;
    }

    getJob() {
        return this.job;
    }

    getStats() {
        return this.stats;
    }

    getStat(stat) {
        return this.stats[stat];
    }

    getId() {
        return this.id;
    }

    getXp() {
        return this.currentXp;
    }

    getXpNeeded() {
        return this.xpNeeded;
    }

    getXpIncrement() {
        return this.xpIncrement;
    }

    getLevel() {
        return this.level;
    }

    getFreeStatPoints() {
        return this.freeStatPoints;
    }

    getLevelLimit() {
        return this.levelLimit;
    }

    getSpecies() {
        return this.species;
    }

    //setters
    setJob(job) {
        this.job = job;
    }

    addXp(amount) {
        if (this.level == this.levelLimit) {
            this.currentXp = 0;
        }
        else {
            this.currentXp += amount;
            this.checkLevelUp();
        }
    }

    checkLevelUp() {
        if (this.currentXp >= this.xpNeeded && !(this.level + 1 > this.levelLimit)) {
            this.levelUp();
        }
    }

    levelUp() {
        this.currentXp = 0;
        this.xpNeeded = Math.floor(this.xpNeeded * this.xpIncrement);

        this.level += 1;
        this.freeStatPoints += Math.ceil(Math.random() * 3)
    }

    increaseStat(stat) {
        this.freeStatPoints -= 1;
        this.stats[stat] += 1;
    }

    setLevelLimit() {
        const misc = useMiscStore();
        this.levelLimit = misc.getDefaultLevelLimit;
    }

    serialize() {
        const serializedCultist = {
            id: this.id,
            name: this.name,
            job: this.job,
            stats: this.stats,
            level: this.level,
            currentXp: this.currentXp,
            xpNeeded: this.xpNeeded,
            xpIncrement: this.xpIncrement,
            freeStatPoints: this.freeStatPoints,
            levelLimit: this.levelLimit,
            species: this.species
        }

        return serializedCultist;
    }
}

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
    const resources = useResourcesStore();
    const costs = useCostsStore();

    var id = cultists.numOfCultists;

    while (cultists.checkIfIdUsed(id)) {
        id++;
    }

    const name = "cultist " + id;

    const cultist = createCultist(id, name, species)

    cultists.addCultist(cultist);

    //removing cost of cultist

    switch(species) {
        case "Human":
            var cost = costs.getCultistCost("human");
            console.log(cost);
            for (var i in cost) {
                resources.modifyResource(i, posToNeg(cost[i]))
            }
            break;
        case "Dwarf":
            var cost = costs.getCultistCost("dwarf");
            console.log(cost);
            for (var i in cost) {
                resources.modifyResource(i, posToNeg(cost[i]))
            }
            break;
        case "Slime":
            var cost = costs.getCultistCost("slime");
            console.log(cost);
            for (var i in cost) {
                resources.modifyResource(i, posToNeg(cost[i]))
            }
    }
    
}


//adding cultists to a job
export function addCultistToJob(cultistId, jobId) {
    //first - instantiate stores
    const cultists = useCultistsStore();
    const jobs = useJobsStore();

    //second - add cultistId to job store
    jobs.addCultistToJob(cultistId, jobId);

    console.log(cultistId);
    console.log(jobId);

    //third - update cultist to give them job
    const cultist = cultists.getCultistById(cultistId);
    cultist.setJob(jobs.getName(jobId));
}


//removing cultists from a job
export function removeCultistFromJob(cultistId) {
    const jobs = useJobsStore();
    const cultists = useCultistsStore();

    jobs.removeCultistFromJob(cultistId);

    const cultist = cultists.getCultistById(cultistId);
    cultist.setJob(null)
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


//building a building
export function buildBuilding(buildingId) {
    const buildings = useBuildingsStore();
    const costs = useCostsStore();

    const cost = costs.getTotalBuildingCost(buildingId);

    const resources = useResourcesStore();

    for (var i in cost) {
        resources.modifyResource(i, posToNeg(cost[i]));
    }

    buildings.buildingBuilding(buildingId)
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




//localStorage functions
export function saveData() {
    //have each pinia store save their data seperately
    const buildings = useBuildingsStore();
    const convos = useConvosStore();
    const costs = useCostsStore();
    const cultists = useCultistsStore();
    const expansions = useExpansionsStore();
    const jobs = useJobsStore();
    const misc = useMiscStore();
    const resources = useResourcesStore();
    const textLog = useTextLogStore();

    buildings.saveData();
    convos.saveData();
    costs.saveData();
    cultists.saveData();
    expansions.saveData();
    jobs.saveData();
    misc.saveData();
    resources.saveData();
    textLog.saveData();
}

export function loadData() {
    //same as save, but this time it's the load
    const buildings = useBuildingsStore();
    const convos = useConvosStore();
    const costs = useCostsStore();
    const cultists = useCultistsStore();
    const expansions = useExpansionsStore();
    const jobs = useJobsStore();
    const misc = useMiscStore();
    const resources = useResourcesStore();
    const textLog = useTextLogStore();

    buildings.loadData();
    convos.loadData();
    costs.loadData();
    cultists.loadData();
    expansions.loadData();
    jobs.loadData();
    misc.loadData();
    resources.loadData();
    textLog.loadData();
}







//HELPER FUNCTIONS
export function posToNeg(num) {
    return -Math.abs(num);
}