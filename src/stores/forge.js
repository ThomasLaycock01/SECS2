import { defineStore } from "pinia";

import { useResourcesStore } from "./globalPinias/resources";
import { useCultistsStore } from "./globalPinias/cultists";
import { useInventoryStore } from "./globalPinias/inventory";
import { useExpansionsStore } from "./globalPinias/expansions";

import items from "../assets/json/items.json";

export const useForgeStore = defineStore("forge", {
    state: () => {
        return {
            actions: {
                expansions: {
                    id: "expansions",
                    name: "Expansions",
                    tooltipType: "expansion",
                    buttons: {
                        expansionSmelter: {
                            id: "expansionSmelter",
                            name: "T3 Expansion: Smelter",
                            desc: "Build a smelter for refining metal.",
                            costs() {
                                const expansions = useExpansionsStore();
                                return expansions.getCostObject("smelter");
                            },
                            condition() {
                                const expansions = useExpansionsStore();
                                const resources = useResourcesStore();
                                return resources.checkIfCanAfford(expansions.getCostObject("forge"));
                            },
                            showCondition() {
                                const expansions = useExpansionsStore();
                                return !expansions.hasTier(3) && expansions.hasExpansion("forge");
                            },
                            effect() {
                                const expansions = useExpansionsStore();
                                expansions.buildExpansion("smelter");
                            }
                        },
                        expansionWarformer: {
                            id: "expansionWarformer",
                            name: "T3 Expansion: Warformer",
                            desc: "Build a space for creating Warforms out of weapons and armour.",
                            costs() {
                                const expansions = useExpansionsStore();
                                return expansions.getCostObject("warformer");
                            },
                            condition() {
                                const expansions = useExpansionsStore();
                                const resources = useResourcesStore();
                                return resources.checkIfCanAfford(expansions.getCostObject("warformer"));
                            },
                            showCondition() {
                                const expansions = useExpansionsStore();
                                return !expansions.hasTier(3) && expansions.hasExpansion("forge");
                            },
                            effect() {
                                const expansions = useExpansionsStore();
                                expansions.buildExpansion("warformer");
                            }
                        }
                    }
                }
            },
            jobs: {
                smith: {
                    id: "smith",
                    cultistArray: [],
                    name: "Blacksmith",
                    xpOutput: 3,
                    limit: 1
                }
            },
            queues: {
                smithingQueue: []
            },
            items: {

            },
            misc: {
                currentSmithingProgress: 0
            }
        }
    },
    getters: {
        //actions
        getActions(state) {
            return state.actions;
        },
        //workers
        getJobObject(state) {
            return (jobId) => {
                return state.jobs[jobId];
            }
        },
        getJobName(state) {
            return (jobId) => {
                return state.jobs[jobId].name;
            }
        },
        getSmithArray(state) {
            return state.jobs.smith.cultistArray;
        },
        getXpAmount(state) {
            return (jobId) => {
                return state.jobs[jobId].xpOutput;
            }
        },
        getJobLimit(state) {
            return (jobId) => {
                return state.jobs[jobId].limit;
            }
        },
        checkIfJobHasSpace(state) {
            return (jobId) => {
                return state.jobs[jobId].cultistArray.length < state.jobs[jobId].limit;
            }
        },
        //queues
        getQueue(state) {
            return state.queues.smithingQueue;
        },
        getCurrentSmithingItem(state) {
            return state.queues.smithingQueue[0];
        },
        getCurrentSmithingPercentage() {
            return Math.round(this.getCurrentSmithingProgress / this.getCurrentSmithingItem.smithCost * 100);
        },
        //misc
        getCurrentSmithingProgress(state) {
            return state.misc.currentSmithingProgress;
        }
    },
    actions: {
        tick() {
            const cultists = useCultistsStore();
            const inventory = useInventoryStore();
            
            //smithing
            if (this.getCurrentSmithingItem) {
                
                this.misc.currentSmithingProgress += 100 * this.getSmithModifier();

                const itemToSmith = this.getCurrentSmithingItem;

                if (this.misc.currentSmithingProgress >= itemToSmith.smithCost) {
                    inventory.addItem(itemToSmith);
                    this.misc.currentSmithingProgress = 0;
                    this.removeFirstQueueEntry("smith");
                }

                for (var i in this.getSmithArray) {
                    const cultist = cultists.getCultistById(this.getSmithArray[i]);
                    cultist.addXp(this.getXpAmount("smith"));
                }
            }
        },
        onBuild() {
            
        },
        //workers
        addToJob(jobId, cultistId, obj) {
             if (cultistId != null) {
                this.jobs[jobId].cultistArray.push(cultistId);
            }
            else {
                this.jobs[jobId].cultistArray.push(obj);
            }
        },
        removeFromJob(jobId, cultistId) {
            this.jobs[jobId].cultistArray = this.jobs[jobId].cultistArray.filter(val => val != cultistId);
        },
        getSmithModifier() {
            const cultists = useCultistsStore();

            const smithArray = this.getSmithArray;
            if (smithArray.length < 1) {
                return 0;
            }

            var totalMod = 0;

            for (var i in smithArray) {
                const smith = cultists.getCultistById(smithArray[i]);
                totalMod += smith.getModifiers("smith", null, 1);
            }

            return totalMod + 1;
        },
        //queues
        CheckIfCanAffordOrder(resourceToAdd, amount) {
            const resources = useResourcesStore();

            const costs = this.getResourceCostsByAmount(resourceToAdd, amount);

            return resources.checkIfCanAfford(costs);
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
                    break;
                case "smith":
                    this.queues.smithingQueue.shift();
                    break;
                default:
                    console.log("error in forge.removeFirstQueueEntry");
            }
        },
        //items
        instantiateItems() {
            this.items = items.forge;
        },
        getItemsByMetal(metalType) {
            const returnArray = [];
            for (var i in this.items) {
                console.log(this.items[i])
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
        },
        //buildings
        buildBuilding(buildingId) {
            this.buildings[buildingId].owned += 1;

            return this.buildings[buildingId].costs;
        },
        updateBuildingCost(buildingId) {
            if (this.buildings[buildingId].exponents) {
                for (var i in this.buildings[buildingId].costs) {
                    this.buildings[buildingId].costs[i] = Math.round(this.buildings[buildingId].costs[i] * this.buildings[buildingId].exponents[i]);
                }
            }
        }
    }
})