import { defineStore } from "pinia";

import { useCultistsStore } from "./globalPinias/cultists";
import { useExpansionsStore } from "./expansions";
import { useResourcesStore } from "./globalPinias/resources";

export const useWarformerStore = defineStore("warformer", {
    state: () => {
        return{
            actions: {
                actions: {
                    id: "actions",
                    name: "Actions",
                    tooltipType: "action",
                    buttons : {
                    }
                },
                buildings: {
                    id: "buildings",
                    name: "Buildings",
                    tooltipType: "building",
                    buttons: {

                    }
                },
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
                        }
                    }
                }
            },
            jobs: {
                warformer: {
                    id: "warformer",
                    cultistArray: [],
                    name: "Warformer",
                    xpOutput: 3,
                    limit: 1
                }
            },
            queues: {
                warformingQueue: []
            },
            buildings: {
            },
            misc: {
                currentWarformingProgress: 0
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
        getWarformerArray(state) {
            return state.jobs.warformer.cultistArray;
        },
        //queues
        getQueue(state) {
            return state.queues.warformingQueue;
        },
        getCurrentSummoning(state) {
            return state.queues.warformingQueue[0];
        },
        getCurrentSummoningPercentage() {
            return Math.round(this.getCurrentWarformingProgress / this.getCurrentSummoning * 100);
        },
        //misc
        getCurrentWarformingProgress(state) {
            return state.misc.currentWarformingProgress;
        }
    },
    actions: {
        tick() {
 
        },
        onBuild() {
            
        },
        //workers
        addToJob(jobId, cultistId = null, obj = null) {
            const job = this.getJobObject(jobId);

            if (job.isUnique) {
                this.jobs[jobId].cultistId = cultistId;
            }
            else if (cultistId != null) {
                this.jobs[jobId].cultistArray.push(cultistId);
            }
            else {
                this.jobs[jobId].cultistArray.push(obj);
            }
        },
        removeFromJob(jobId, cultistId = null) {
            if (cultistId === null) {
                const cultists = useCultistsStore();
                const cultist = cultists.getCultistById(this.jobs[jobId].cultistId);
                cultist.removeJob();
                this.jobs[jobId].cultistId = null;
            }
            else {
                this.jobs[jobId].cultistArray = this.jobs[jobId].cultistArray.filter(val => val != cultistId);
            }
        },
        getWarformerModifier() {
            const cultists = useCultistsStore();

            const warformerArray = this.getWarformerArray;
            if (smithArray.length < 1) {
                return 0;
            }

            var totalMod = 0;

            for (var i in warformerArray) {
                const warformer = cultists.getCultistById(warformerArray[i]);
                totalMod += warformer.getModifiers("warformer", null, 1);
            }

            return totalMod + 1;
        },
        //queues
        CheckIfCanAffordOrder(resourceToAdd, amount) {
            const resources = useResourcesStore();

            const costs = this.getResourceCostsByAmount(resourceToAdd, amount);

            return resources.checkIfCanAfford(costs);
        },
        addToWarformingQueue(itemToAdd) {
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
        },
        instantiateBuildings() {
            const id = this.$id;

            this.buildings = buildings["forge"];
            for (var i in this.buildings) {
                this.buildings[i]["owned"] = 0;
            }

            for (var i in this.buildings) {
                const buildingObj = this.buildings[i];

                this.actions.buildings.buttons[i] = {
                    id: buildingObj["id"],
                    name: buildingObj["name"],
                    desc: buildingObj["desc"],
                    effectDesc: buildingObj["effectDesc"],
                    limit: buildingObj["limit"],
                    owned() {
                        const buildings = useBuildingsStore();
                        return buildings.getNumOfBuildings(buildingObj.id);
                    },
                    costs() {
                        return buildingObj["costs"];
                    },
                    condition() {
                        const resources = useResourcesStore();
                        const buildings = useBuildingsStore();
                        return resources.checkIfCanAfford(buildingObj.costs) && this.owned() < buildingObj.limit;
                    },
                    showCondition() {
                        const resources = useResourcesStore();
                        const expansions = useExpansionsStore();
                        const buildings = useBuildingsStore();
                        return resources.getEvilness >= buildingObj.reqs.evilness && expansions.hasTier(buildingObj.reqs.expansionTier) && (buildings.checkBuildingReqs(buildingObj.reqs.buildings) || !buildingObj.reqs.buildings);
                    },
                    effect() {
                        const buildings = useBuildingsStore();
                        buildings.buildBuildings(id, buildingObj.id);
                    }
                }
            }
        }
    }
})