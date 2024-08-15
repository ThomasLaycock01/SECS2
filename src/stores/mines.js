import { defineStore } from "pinia";

import { useCultistsStore } from "./cultists";

import items from "../assets/items.json";

export const useMinesStore = defineStore("mines", {
    state: () => {
        return {
            mineshaft: {
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
        getOverseer(state) {
            return state.mineshaft.overseer;
        },
        getWorkerJobName(state) {
            return state.misc.workerJobName;
        },
        getOverseerJobName(state) {
            return state.misc.overseerJobName;
        },
        getResources(state) {
            return state.resources;
        },
        getResourceById(state) {
            return (id) => state.resources[id];
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
        tick() {
            //console.log("Tick working");
        },
        instantiateItems() {
            this.items = items.mines;
        },
        assignOverseer(cultistId) {
            this.mineshaft.overseer = cultistId;
        },
        addWorker(obj) {
            this.mineshaft.workerArray.push(obj);
        },
        removeOverseer() {
            this.mineshaft.overseer = null;
        },
        removeWorker(cultistId) {
            this.mineshaft.workerArray = this.mineshaft.workerArray.filter((id) => id != cultistId);
        },
        getCultistArray() {
            const cultists = useCultistsStore();

            const cultistArray = [];

            for (var i in this.mineshaft.workerArray) {
                const cultist = cultists.getCultistById(this.mineshaft.workerArray[i].id);
                const resource = this.getResourceById(this.mineshaft.workerArray[i].resource )
                const obj = {
                    cultist: cultist,
                    resource: resource
                }
                cultistArray.push(obj);
            }

            console.log(cultistArray);

            return cultistArray;
        },
        saveData() {
            var data = JSON.parse(localStorage.getItem("SECSData"));

            data.mines = this.mineshaft;

            localStorage.setItem("SECSData", JSON.stringify(data));
        },
        loadData() {
            var data = JSON.parse(localStorage.getItem("SECSData"));

            this.mineshaft = data.mines;
        }
    }
})