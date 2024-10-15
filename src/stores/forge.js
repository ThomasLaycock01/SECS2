import { defineStore } from "pinia";

import { useResourcesStore } from "./globalPinias/resources";
import { useExpansionsStore } from "./expansions";
import { useCultistsStore } from "./globalPinias/cultists";

export const useForgeStore = defineStore("forge", {
    state: () => {
        return {
            actions: {
                actions: {
                    id: "actions",
                    name: "Actions",
                    tooltipType: "action",
                    buttons : {
                        beEvil2: {
                            id: "beEvil2",
                            name: "Be Evil >:)",
                            desc: "Be Evil - and Gain 1 Evilness",
                            condition() {
                                return true;
                            },
                            showCondition() {
                                return true;
                            },
                            effect() {
                                const resources = useResourcesStore();
                                resources.modifyResource("evilness", 1)
                            }
                        }
                    }
                }
            },
            workers: {
                smelter: null,
                smith: null
            },
            resources: {
                copperBars: {
                    id:"copperBars",
                    name:"Copper Bars",
                    total: 0,
                    perSec: 0,
                    consumedPerSec: 0,
                    costs: {
                        copper: 10
                    }, 
                    showCondition() {
                        const expansions = useExpansionsStore();
                        return expansions.hasTier(2);
                    },
                    unlockCondition() {
                        return true;
                    }
                }
            },
            queues: {
                smeltingQueue: []
            },
            misc: {
                smelterJobName: "Smelter",
                smithJobName: "Blacksmith"
            }
        }
    },
    getters: {
        //actions
        getActions(state) {
            return state.actions;
        },
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
        getUnlockResources(state) {
            const returnArray = [];
            for (var i in state.resources) {
                if (state.resources[i].unlockCondition()) {
                    returnArray.push(state.resources[i]);
                }
            }
            return returnArray;
        },
        getResourceName(state) {
            return (id) => state.resources[id].name;
        },
        getResourceCosts(state) {
            return (id) => state.resources[id].costs;
        },
        getResourceCostsByAmount(state) {
            return (id, amount) => {
                const costsObj = {};
                for (var i in state.resources[id].costs) {
                    costsObj[i] = state.resources[id].costs[i] * amount;
                }
                return costsObj;
            } 
        },
        //workers
        getSmelter(state) {
            if (state.workers.smelter == null) {
                return null;
            }
            const cultists = useCultistsStore();
            return cultists.getCultistById(state.workers.smelter);
        },
        getWorkerArray(state) {
            return state.workers.workerArray;
        },
        getNumOfWorkers(state) {
            return state.workers.workerArray.length;
        },
        //queues
        getQueue(state) {
            return (queueType) => {
                switch (queueType) {
                    case "smelter":
                        return state.queues.smeltingQueue;
                    default:
                        console.log("error in forge.getQueue");
                }
            }
        }
    },
    actions: {
        tick() {
            console.log("forge tick")
        },
        //resources
        modifyResource(resource, amount) {
            this.resources[resource].total += amount;
        },
        setResourcePerSec(resource, amount) {
            this.resources[resource].perSec = amount;
        },
        //workers
        assignOther(cultistId, jobId) {
            switch (jobId) {
                case "smelter":
                    this.workers.smelter = cultistId;
                    return this.misc.smelterJobName;
                case "smith":
                    this.workers.smith = cultistId;
                    return this.misc.smithJobName;
                default:
                    console.log("something went wrong in forge.assignOther")
            }
        },
        removeOther(jobId) {
            switch (jobId) {
                case "smelter":
                    this.workers.smelter = null;
                    break;
                case "smith":
                    this.workers.smith = null;
                    break;
                default:
                    console.log("something went wrong in forge.removeOther")
            }
        },
        getOverseerModifier() {
            const overseer = this.getOverseer;
            if (overseer == null) {
                return 0.5;
            }

            return overseer.getGlobalModifiers("mineOverseer") + 1;
        },
        addWorker(obj) {
            this.workers.workerArray.push(obj);
        },
        removeWorker(cultistId) {
            this.workers.workerArray = this.workers.workerArray.filter((obj) => obj.id != cultistId);
        },
        //queues
        CheckIfCanAffordOrder(resourceToAdd, amount) {
            const resources = useResourcesStore();

            const costs = this.getResourceCostsByAmount(resourceToAdd, amount);

            return resources.checkIfCanAfford(costs);
        },
        addToSmeltingQueue(obj) {
            this.queues.smeltingQueue.push(obj);
        }
    }
})