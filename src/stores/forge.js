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
        getUnlockedResources(state) {
            //doing same cheat as mines here for now - fix once actual resource unlocks are implemented
            const returnArray = [];
            for (var i in state.resources) {
                    returnArray.push(state.resources[i]);
            }
            return returnArray;
        },
        getResourceName(state) {
            return (id) => state.resources[id].name;
        },
        getResourceProperties(state) {
            return (id) => state.resources[id].properties;
        },
        getResourceCosts(state) {
            return (id) => state.resources[id].properties.costs;
        },
        getResourceCostsByAmount(state) {
            return (id, amount) => {
                const costsObj = {};
                for (var i in state.resources[id].properties.costs) {
                    costsObj[i] = state.resources[id].properties.costs[i] * amount;
                }
                return costsObj;
            } 
        },
        getResourceSmeltingCost(state) {
            return (id) => state.resources[id].properties.smeltingCost;
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
        },
        getCurrentSmeltingItem(state) {
            return state.queues.smeltingQueue[0];
        },
        getCurrentSmithingItem(state) {
            return state.queues.smithingQueue[0];
        },
        getNameOfCurrentBar(state) {
            return this.getResourceName(state.queues.smeltingQueue[0].barType);
        },
        getSmeltingCostOfCurrentBar(state) {
            return this.getResourceSmeltingCost(state.queues.smeltingQueue[0].barType);
        },
        getCurrentSmeltingPercentage() {
            return this.getCurrentSmeltingProgress / this.getSmeltingCostOfCurrentBar * 100;
        },
        getCurrentSmithingPercentage() {
            return this.getCurrentSmithingProgress / this.getCurrentSmithingItem.smithCost * 100;
        },
        //misc
        getCurrentSmeltingProgress(state) {
            return state.misc.currentSmeltingProgress;
        },
        getCurrentSmithingProgress(state) {
            return state.misc.currentSmithingProgress;
        }
    },
    actions: {
        tick() {
            const inventory = useInventoryStore();

            //smelting
            if (this.getCurrentSmeltingItem) {
                this.misc.currentSmeltingProgress += 100 * this.getSmelterModifier();

                if (this.misc.currentSmeltingProgress >= this.getSmeltingCostOfCurrentBar) {
                    this.misc.currentSmeltingProgress = 0;
                    this.getCurrentSmeltingItem.amount--;

                    this.modifyResource(this.getCurrentSmeltingItem.barType, 1);

                    if (this.getCurrentSmeltingItem.amount == 0) {
                        this.removeFirstQueueEntry("smelter");
                    }
                }
            }
            
            //smithing
            if (this.getCurrentSmithingItem) {
                
                this.misc.currentSmithingProgress += 100 * this.getSmithModifier();

                const itemToSmith = this.getCurrentSmithingItem;

                if (this.misc.currentSmithingProgress >= itemToSmith.smithCost) {
                    inventory.addItem(itemToSmith);
                    this.misc.currentSmithingProgress = 0;
                    this.queues.smithingQueue.shift();
                }
            }
        },
        //resources
        instantiateResource(resourceObj) {
            this.resources[resourceObj.id] = resourceObj;
        },
        modifyResource(resource, amount) {
            const resources = useResourcesStore();
            this.resources[resource].total += amount;
            resources.updatedLocked();
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

            console.log(costs);

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