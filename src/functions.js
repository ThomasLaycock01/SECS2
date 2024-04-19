import { useResourcesStore } from "./stores/resources";
import { useCultistsStore } from "./stores/cultists";
import { useJobsStore } from "./stores/jobs";


//tick system
export function tick() {
    const resources = useResourcesStore();

    calculateResource();
}

//calculating gold output
export function calculateResource() {
    const jobs = useJobsStore();
    const resources = useResourcesStore();

    const arrayOfJobs = jobs.getByProdType("Gold");


    var totalResourceOutput = 0;
    for (var i in arrayOfJobs) {
        for (var j in arrayOfJobs[i].array) {
            totalResourceOutput += 1;
        }
    }

    console.log(totalResourceOutput);
    resources.setResourcePerSec("Gold", totalResourceOutput);
}


//creating cultists
class Cultist {
    constructor(id, name) {
        this.id = id;
        this.name = name + this.id;
        this.job = null;
    }

    //getters
    getName() {
        return this.name;
    }

    //setters
    setJob(job) {
        this.job = job;
    }
}

export function addCultist() {
    const store = useCultistsStore();

    const id = store.numOfCultists;

    const cultist = new Cultist(id, "cultist");

    store.addCultist(cultist);
    
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