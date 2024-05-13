import { useResourcesStore } from "./stores/resources";
import { useCultistsStore } from "./stores/cultists";
import { useJobsStore } from "./stores/jobs";
import { useExpansionsStore } from "./stores/expansions";
import { useMiscStore } from "./stores/misc";
import { useBuildingsStore } from "./stores/buildings";


//tick system
export function tick() {
    const resources = useResourcesStore();

    //adding resources
    for (var i in resources.getAll) {
        calculateResource(i);
    }

    updateResources();

    //updating xp for cultists
    updateCultistXp();
}

//calculating gold output
function calculateResource(resource) {
    const jobs = useJobsStore();
    const resources = useResourcesStore();

    const arrayOfJobs = jobs.getByProdType(resource);

    //very bulky, but this just multiplies the total output of the job by the associated stat from each cultist in its job array
    var totalResourceOutput = 0;
    for (var i in arrayOfJobs) {
        const associatedStat = jobs.getAssociatedStat(resource, i);
        for (var j in jobs.getArray(resource, i)) {
            //silly way of doing this - come back later and write something better (weird way of grabbing the associated stat)
            totalResourceOutput += jobs.getOutput(resource, i) * jobs.getArray(resource, i)[j].getStat(associatedStat);
        }
    }

    resources.setResourcePerSec(resource, totalResourceOutput);
}

//updating the resources
function updateResources() {
    const resources = useResourcesStore();

    for (var i in resources.getAll) {
        resources.modifyResource(i, resources.getResourcePerSec(i));
    }
}




//class for creating cultists - will need expanding
class Cultist {
    constructor(id, name) {
        this.id = id;
        this.name = name + this.id;
        this.job = null;
        this.stats = {str: 1, int: 1, agi: 1, cha: 1};
        this.level = 1;
        this.currentXp = 0;
        this.xpNeeded = 20;
        this.xpIncrement = 1.1;
        this.freeStatPoints = 0;
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

    //setters
    setJob(job) {
        this.job = job;
    }

    addXp(amount) {
        this.currentXp += amount;
        this.checkLevelUp();
    }

    checkLevelUp() {
        if (this.currentXp >= this.xpNeeded) {
            this.levelUp();
        }
    }

    levelUp() {
        this.currentXp = 0;
        this.xpNeeded = Math.floor(this.xpNeeded * this.xpIncrement);

        this.level += 1;
        this.freeStatPoints += Math.round(Math.random() * 3)
    }

    increaseStat(stat) {
        this.freeStatPoints -= 1;
        this.stats[stat] += 1;
    }
}

//creating new cultists
export function addCultist() {
    const store = useCultistsStore();

    const id = store.numOfCultists;

    const cultist = new Cultist(id, "cultist");

    store.addCultist(cultist);

    //removing cost of cultist
    const resources = useResourcesStore();

    resources.modifyResource("Gold", -20);

    //incrementing num of cultists to track limit
    const misc = useMiscStore();

    misc.addCultist();
    
}


//adding cultists to a job
export function addCultistToJob(cultistId, resource, job) {
    //first - instantiate stores
    const cultists = useCultistsStore();
    const jobs = useJobsStore();

    //second - add cultistId to job store
    jobs.addCultistToJobArray(cultistId, resource, job);

    //third - update cultist to give them job
    const cultist = cultists.getCultistById(cultistId);
    cultist.setJob(jobs.getName(resource, job));
}


//removing cultists from a job
export function removeCultistFromJob(cultistId) {
    const jobs = useJobsStore();
    const cultists = useCultistsStore();

    jobs.removeCultistfromJob(cultistId);

    const cultist = cultists.getCultistById(cultistId);
    cultist.setJob(null)
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

    console.log(jobs.checkIfAtLimit("Gold", "miner"))
}








//HELPER FUNCTIONS
//for turning numbers into negatives
export function posToNeg(num) {
    return -Math.abs(num);
}