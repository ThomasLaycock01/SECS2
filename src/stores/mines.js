import { defineStore } from "pinia";

import { useCultistsStore } from "./cultists";

import items from "../assets/items.json";

export const useMinesStore = defineStore("mines", {
    state: () => {
        return {
            mineshaft: {
                overseer: null,
                workerArray: [],
                maxDepth: 1000,
                currentDepth: 0
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
        getDepth(state) {
            return state.mineshaft.currentDepth;
        },
        getMaxDepth(state) {
            return state.mineshaft.maxDepth;
        },
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
        getResourceProduction(state) {
            return (resource) => Math.floor(state.mineshaft.currentDepth / state.resources[resource].multiplier);
        }
    },
    actions: {
        tick() {
            console.log("Tick working");
        },
        instantiateItems() {
            this.items = items.mines;
        },
        assignOverseer(cultistId) {
            this.mineshaft.overseer = cultistId;
        },
        addWorker(cultistId) {
            this.mineshaft.workerArray.push(cultistId);
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
                const cultist = cultists.getCultistById(this.mineshaft.workerArray[i]);
                cultistArray.push(cultist);
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