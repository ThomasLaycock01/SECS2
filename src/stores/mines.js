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
        getOverseer(state) {
            return state.workers.overseer;
        },
        getWorkerJobName(state) {
            return state.misc.workerJobName;
        },
        getOverseerJobName(state) {
            return state.misc.overseerJobName;
        },
        getUnlockResources(state) {
            const returnArray = [];
            for (var i in state.resources) {
                if (state.resources[i].unlockCondition()) {
                    returnArray.push(state.resources[i]);
                }
            }
            return returnArray;
        }
    },
    actions: {
        //tick
        tick() {
            //console.log("Tick working");
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
        addWorker(obj) {
            this.workers.workerArray.push(obj);
        },
        removeOverseer() {
            this.workers.overseer = null;
        },
        removeWorker(cultistId) {
            this.workers.workerArray = this.workers.workerArray.filter((id) => id != cultistId);
        },
        getCultistArray() {
            const cultists = useCultistsStore();

            const cultistArray = [];

            for (var i in this.workers.workerArray) {
                const cultist = cultists.getCultistById(this.workers.workerArray[i].id);
                const resource = this.getResourceById(this.workers.workerArray[i].resource )
                const obj = {
                    cultist: cultist,
                    resource: resource
                }
                cultistArray.push(obj);
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