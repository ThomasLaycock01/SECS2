import { useResourcesStore } from "./stores/resources";
import { useCultistsStore } from "./stores/cultists";
import { useJobsStore } from "./stores/jobs";
import { useExpansionsStore } from "./stores/expansions";
import { useMiscStore } from "./stores/misc";
import { useBuildingsStore } from "./stores/buildings";
import { useTextLogStore } from "./stores/textLog";
import { useCostsStore } from "./stores/costs";


//tick system
export function tick() {
    const resources = useResourcesStore();

    //adding resources
    for (var i in resources.getAll) {
        switch(i) {
            case "Evilness":
                calculateEvilness();
                break;
            case "Slime":
                calculateSlime();
                break;
            default:
                calculateResource(i);
        }


    }

    updateResources();

    //updating xp for cultists
    updateCultistXp();

    saveData();
}


//calculating evilness output, since its different from other resources
function calculateEvilness() {
    const cultists = useCultistsStore();
    const resources = useResourcesStore();

    var totalEvilnessOutput = 0;
    for (var i in cultists.regularCultists) {
        totalEvilnessOutput += cultists.regularCultists[i].getLevel();
    }

    resources.setResourcePerSec("Evilness", totalEvilnessOutput);
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

    resources.setResourcePerSec("Slime", totalSlimeOutput);
}


//calculating resource output
function calculateResource(resource) {
    //first - instantiate stores
    const jobs = useJobsStore();
    const resources = useResourcesStore();


    //second - get jobs with matching resource
    const arrayOfJobs = jobs.getByOutput(resource);

    //third - calculate output
    var totalResourceOutput = 0;

    for (var i in arrayOfJobs) {
        const job = arrayOfJobs[i];
        const associateStat = job["stat"];
        for (var j in job["baseArray"]) {
            totalResourceOutput = job["baseArray"][j].getStat(associateStat);
        }
        for (var j in job["modifiers"]) {
            totalResourceOutput = Math.floor(totalResourceOutput * job["modifiers"][j].modifier());
        }
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


//calculating cultist limit
function calculateLimits() {
    const misc = useMiscStore();

    misc.calculateCultistLimit();


}



//class for creating cultists - will need expanding
class Cultist {
    constructor(id, name, species) {
        this.id = id;
        this.name = name + this.id;
        this.job = null;
        this.stats = {str: 1, int: 1, agi: 1, cha: 1};
        this.level = 1;
        this.currentXp = 0;
        this.xpNeeded = 20;
        this.xpIncrement = 1.5;
        this.freeStatPoints = 0;
        this.levelLimit = 10;
        this.species = species;
    }

    //getters
    getName() {
        return this.name;
    }

    getJob() {
        return this.job;
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

    const cultist = new Cultist(id, "cultist", species);

    cultists.addCultist(cultist);

    //removing cost of cultist

    switch(species) {
        case "Human":
            const cost = costs.getCultistCost("human");
            console.log(cost);
            for (var i in cost) {
                resources.modifyResource(i, posToNeg(cost[i]))
            }
            //resources.modifyResource("Gold", costs.getCultistCost("human"));
            break;
        case "Dwarf":
            resources.modifyResource("Gold", -2000);
            break;
        case "Slime":
            resources.modifyResource("Gold", -2500);
            resources.modifyResource("Crystals", -1000);
    }

    //incrementing num of cultists to track limit
    const misc = useMiscStore();

    misc.addCultist();
    
}


//adding cultists to a job
export function addCultistToJob(cultistId, jobId) {
    //first - instantiate stores
    const cultists = useCultistsStore();
    const jobs = useJobsStore();

    //second - add cultistId to job store
    jobs.addCultistToJob(cultistId, jobId);

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
    const misc = useMiscStore();

    removeCultistFromJob(cultistId);

    cultists.removeCultist(cultistId);
    misc.removeCultist();
}


//adding xp to cultists with jobs
function updateCultistXp() {
    const cultists = useCultistsStore();

    const cultistArray = cultists.getEmployed

    for (var i in cultistArray) {
        cultistArray[i].addXp(1);
    }
}



//building expansions
export function buildExpansion(expansionId) {
    const expansions = useExpansionsStore();
    expansions.buildExpansion(expansionId);


    //calculating limits for cultists
    calculateLimits();
}


//building a building
export function buildBuilding(buildingId) {
    const buildings = useBuildingsStore();
    buildings.buildingBuilding(buildingId)

    const costs = buildings.getBuildingCostsById(buildingId);

    const resources = useResourcesStore();

    for (var i in costs) {
        resources.modifyResource(i, posToNeg(costs[i]));
    }

    const jobs = useJobsStore();
}



//localStorage functions
function saveData() {
    //got to use slightly different names here, otherwise get cyclic value error
    const resourcesStore = useResourcesStore();
    const cultistsStore = useCultistsStore();

    const storageData = localStorage.getItem("SECSData");
    var data = JSON.parse(storageData);

    //resources
    data.resources = resourcesStore.getAll;

    const JSONData = JSON.stringify(data);

    localStorage.setItem("SECSData", JSON.stringify(data));


}

export function loadData() {
    const resourcesStore = useResourcesStore();

    const data = JSON.parse(localStorage.getItem("SECSData"));

    resourcesStore.loadData(data.resources)
}



//HELPER FUNCTIONS
export function posToNeg(num) {
    return -Math.abs(num);
}