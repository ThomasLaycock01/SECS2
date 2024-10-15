import { defineStore } from "pinia";

import { useResourcesStore } from "./globalPinias/resources";
import { useExpansionsStore } from "./expansions";
import { useCultistsStore } from "./globalPinias/cultists";
import { useInventoryStore } from "./globalPinias/inventory";

import items from "../assets/json/items.json";

export const useForgeStore = defineStore("forge", {
    state: () => {
        return {
            actions: {
                actions: {
                    id: "actions",
                    name: "Actions",
                    tooltipType: "action",
                    buttons : {
                        debugCopperBars: {
                            id: "debugCopperBars",
                            name: "debug copper bars",
                            desc: "Be Evil - and Gain 1 Evilness",
                            condition() {
                                return true;
                            },
                            showCondition() {
                                return true;
                            },
                            effect() {
                                const forge = useForgeStore();
                                forge.modifyResource("copperBars", 1000000)
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
                    smeltingCost: 1000, 
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
                smeltingQueue: [],
                smithingQueue: []
            },
            items: {

            },
            misc: {
                smelterJobName: "Smelter",
                smithJobName: "Blacksmith",
                currentSmeltingProgress: 0,
                currentSmithingProgress: 0
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
        getResourceSmeltingCost(state) {
            return (id) => state.resources[id].smeltingCost;
        },
        //workers
        getSmelter(state) {
            if (state.workers.smelter == null) {
                return null;
            }
            const cultists = useCultistsStore();
            return cultists.getCultistById(state.workers.smelter);
        },
        getSmith(state) {
            if (state.workers.smith == null) {
                return null;
            }
            const cultists = useCultistsStore();
            return cultists.getCultistById(state.workers.smith);
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
                    case "smith":
                        return state.queues.smithingQueue;
                    default:
                        console.log("error in forge.getQueue");
                }
            }
        }
    },
    actions: {
        tick() {
            //smelting
            if (this.getQueue("smelter").length > 0) {
                
                this.misc.currentSmeltingProgress += 100 * this.getSmelterModifier();

                while (this.misc.currentSmeltingProgress >= this.getResourceSmeltingCost(this.getQueue("smelter")[0].barType)) {

                    this.misc.currentSmeltingProgress -= this.getResourceSmeltingCost(this.getQueue("smelter")[0].barType);
                    this.queues.smeltingQueue[0].amount--;

                    this.modifyResource(this.getQueue("smelter")[0].barType, 1);

                    if (this.queues.smeltingQueue[0].amount == 0) {
                        this.removeFirstQueueEntry("smelter");
                    }
                }
            }
            
            //smithing
            if (this.getQueue("smith").length > 0) {
                const inventory = useInventoryStore();
                
                this.misc.currentSmithingProgress += 100 * this.getSmithModifier();

                const itemToSmith = this.getQueue("smith")[0];

                if (this.misc.currentSmithingProgress >= itemToSmith.smithCost) {
                    inventory.addItem(itemToSmith);
                    this.misc.currentSmithingProgress = 0;
                    this.queues.smithingQueue.shift();
                }
            }
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
        getSmelterModifier() {
            const smelter = this.getSmelter;
            if (smelter == null) {
                return 0;
            }

            return smelter.getGlobalModifiers("smelter") + 1;
        },
        getSmithModifier() {
            const smelter = this.getSmith;
            if (smelter == null) {
                return 0;
            }

            return smelter.getGlobalModifiers("smith") + 1;
        },
        //queues
        CheckIfCanAffordOrder(resourceToAdd, amount) {
            const resources = useResourcesStore();

            const costs = this.getResourceCostsByAmount(resourceToAdd, amount);

            return resources.checkIfCanAfford(costs);
        },
        addToSmeltingQueue(barToAdd, amountToAdd) {
            const resources = useResourcesStore();

            const queueObj = {
                barType: barToAdd,
                amount: amountToAdd
            }

            this.queues.smeltingQueue.push(queueObj);

            resources.removeResources(this.getResourceCostsByAmount(barToAdd, amountToAdd));

        },
        addToSmithingQueue(itemToAdd) {
            const resources = useResourcesStore();

            this.queues.smithingQueue.push(itemToAdd);

            resources.removeResources(itemToAdd.craftCosts);

        },
        removeFirstQueueEntry(type) {
            switch (type) {
                case "smelter":
                    this.queues.smeltingQueue.shift();
            }
        },
        //items
        instantiateItems() {
            this.items = items.forge;
        },
        getItemsByMetal(metalType) {
            const returnArray = [];
            for (var i in this.items) {
                if (this.items[i].craftCosts[metalType]) {
                    returnArray.push(this.items[i]);
                }
            }
            return returnArray;
        },
        checkIfCanAffordItem(item) {
            const resources = useResourcesStore();

            const costs = item.craftCosts;

            return resources.checkIfCanAfford(costs);
        }
    }
})