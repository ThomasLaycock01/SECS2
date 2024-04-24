import { useResourcesStore } from "./stores/resources";
import { useCultistsStore } from "./stores/cultists";
import { useJobsStore } from "./stores/jobs";


//tick system
export function tick() {
    const resources = useResourcesStore();

    for (var i in resources.getAll) {
        calculateResource(i);
    }

    updateResources();
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
            console.log(jobs.getOutput(resource, i))
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
        this.stats = {str: 1, int: 1, agi: 1, cha: 1}
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

    //setters
    setJob(job) {
        this.job = job;
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
    
}


//adding cultists to a job
export function addCultistToJob(cultistId) {
    //first - instantiate stores
    const cultists = useCultistsStore();
    const jobs = useJobsStore();

    //second - add cultistId to job store
    jobs.addCultistToJobArray(cultistId, "Gold", "miner");

    //third - update cultist to give them job
    const cultist = cultists.getCultistById(cultistId);
    cultist.setJob("Miner");
}