import { useCultistsStore } from "./stores/cultists";
import { useJobsStore } from "./stores/jobs";

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
    jobs.addCultistToJob(cultistId, "miner");

    //third - update cultist to give them job
    const cultist = cultists.getCultistById(cultistId);
    cultist.setJob("Miner");
}