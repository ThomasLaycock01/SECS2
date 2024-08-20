import { defineStore } from "pinia";

import { useCultistsStore } from "./cultists";

import items from "../assets/items.json";

export const useMinesStore = defineStore("mines", {
    state: () => {
        return {
            workers: {
                overseer: null,
                workerArray: []
            },
            resources: {
                stone: {id:"stone", name:"Stone", total: 0, perSec: 0, 
                    showCondition(){
                        const expansions = useExpansionsStore(); 
                        return expansions.hasTier1}, 
                    unlockCondition() {
                        return true;
                    }}
            },
            items: {
            },
            misc: {
                workerJobName: "Miner",
                overseerJobName: "Mine Overseer"
            }
        }
    },
    getters: {
        //resources
        getResources(state) {
            return state.resources;
        },
        getResourceObject(state) {
            return (id) => state.resources[id];
        },
        getResourceTotal(state) {
            return (id) => state.resources[id].total;
        },
        getResourcePerSec(state) {
            return (id) => state.resources[id].perSec;
        },
        //workers
        getOverseer(state) {
            if (state.workers.overseer == null) {
                return null;
            }
            const cultists = useCultistsStore();
            return cultists.getCultistById(state.workers.overseer);
        },
        getUnlockResources(state) {
            const returnArray = [];
            for (var i in state.resources) {
                if (state.resources[i].unlockCondition()) {
                    returnArray.push(state.resources[i]);
                }
            }
            return returnArray;
        },
        getWorkerArray(state) {
            return this.workers.workerArray;
        },
        //misc
        getWorkerJobName(state) {
            return state.misc.workerJobName;
        },
        getOverseerJobName(state) {
            return state.misc.overseerJobName;
        },
    },
    actions: {
        //tick
        tick() {
            //pinia stores
            const cultists = useCultistsStore();
            //first - get overseer modifier
            const overseerMod = this.getOverseerModifier();
            console.log(overseerMod);

            //second - calculate output of each resource
            for (var i in this.getResources) {
                var resourceOutput = 0;
                for (var j in this.getWorkerArray) {
                    console.log(i);
                    console.log(this.getWorkerArray[j].resource);
                    if (this.getWorkerArray[j].resource == i) {
                        const cultist = cultists.getCultistById(this.getWorkerArray[j].id);
                        resourceOutput += 1 * (1 + 0.1 * (cultist.getLevel() - 1))
                        console.log(resourceOutput);
                    }
                }
                this.resources[i].perSec = resourceOutput;
                this.resources[i].total += this.resources[i].perSec;
            }
        },
        //resources
        modifyResource(resource, amount) {
            this.resources[resource].total += amount;
        },
        setResourcePerSec(resource, amount) {
            this.resources[resource].perSec = amount;
        },
        //items
        instantiateItems() {
            this.items = items.mines;
        },
        //workers
        assignOverseer(cultistId) {
            this.workers.overseer = cultistId;
        },
        removeOverseer() {
            this.workers.overseer = null;
        },
        getOverseerModifier() {
            const overseer = this.getOverseer;
            if (overseer == null) {
                return 0.5;
            }
            var mod = 1 + (0.1 * (overseer.getLevel() - 1));

            for (var i in overseer.getModifiers()) {
                console.log(i);
                //come back and finihs this once modifiers are fully implmented
            }

            return mod;
        },
        addWorker(obj) {
            this.workers.workerArray.push(obj);
        },
        removeWorker(cultistId) {
            this.workers.workerArray = this.workers.workerArray.filter((obj) => obj.id != cultistId);
        },
        getCultistArray() {
            const cultists = useCultistsStore();

            const cultistArray = [];

            for (var i in this.workers.workerArray) {
                const cultist = cultists.getCultistById(this.workers.workerArray[i].id);
                const resource = this.getResourceObject(this.workers.workerArray[i].resource )
                const obj = {
                    cultist: cultist,
                    resource: resource
                }
                cultistArray.push(obj);
                cultist.setJob(this.getWorkerJobName)
            }

            console.log(cultistArray);

            return cultistArray;
        },
        //saving/loading
        saveData() {
            var data = JSON.parse(localStorage.getItem("SECSData"));

            data.mines = this.workers;

            localStorage.setItem("SECSData", JSON.stringify(data));
        },
        loadData() {
            var data = JSON.parse(localStorage.getItem("SECSData"));

            this.workers = data.mines;
        }
    }
})