import { defineStore } from "pinia";

import { useCultistsStore } from "./globalPinias/cultists";
import { useResourcesStore } from "./globalPinias/resources";

export const useSmelterStore = defineStore("smelter", {
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
                                const smelter = useForgeStore();
                                smelter.modifyResource("copperBars", 1000000)
                            }
                        }
                    }
                },
                buildings: {
                    id: "buildings",
                    name: "Buildings",
                    tooltipType: "building",
                    buttons: {

                    }
                }
            },
            jobs: {
                smelter: {
                    id: "smelter",
                    cultistArray: [],
                    name: "Smelter",
                    xpOutput: 2,
                    limit: 2
                }
            },
            resources: {
                resources: {},
                locked: []
            },
            queues: {
                smeltingQueue: []
            },
            buildings: {
            },
            misc: {
                currentSmeltingProgress: 0
            }
        }
    },
    getters: {
        //actions
        getActions(state) {
            return state.actions;
        },
        //resources
        getAll(state) {
            return state.resources.resources;
        },
        getResourceTotal(state) {
            return (id) => state.resources.resources[id].total;
        },
        getResourcePerSec(state) {
            return (id) => state.resources.resources[id].perSec;
        },
        checkIfLocked(state) {
            return (id) => state.resources.locked.includes(id);
        },
        getUnlockedResources(state) {
            const returnArray = [];
            for (var i in state.resources.resources) {
                const id = state.resources.resources[i].id;
                if (!state.checkIfLocked(id)) {
                    returnArray.push(state.resources.resources[i]);
                }
            }

            return returnArray;
        },
        getResourceName(state) {
            return (id) => state.resources.resources[id].name;
        },
        getResourceProperties(state) {
            return (id) => state.resources.resources[id].properties;
        },
        getResourceCosts(state) {
            return (id) => state.resources.resources[id].properties.costs;
        },
        getResourceCostsByAmount(state) {
            return (id, amount) => {
                const costsObj = {};
                for (var i in state.resources.resources[id].properties.costs) {
                    costsObj[i] = state.resources.resources[id].properties.costs[i] * amount;
                }
                return costsObj;
            } 
        },
        getResourceSmeltingCost(state) {
            return (id) => state.resources.resources[id].properties.smeltingCost;
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
        getSmelterArray(state) {
            return state.jobs.smelter.cultistArray;
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
            return state.queues.smeltingQueue;
        },
        getCurrentSmeltingItem(state) {
            return state.queues.smeltingQueue[0];
        },
        getNameOfCurrentBar(state) {
            return this.getResourceName(state.queues.smeltingQueue[0].barType);
        },
        getSmeltingCostOfCurrentBar(state) {
            return this.getResourceSmeltingCost(state.queues.smeltingQueue[0].barType);
        },
        getCurrentSmeltingPercentage() {
            return Math.round(this.getCurrentSmeltingProgress / this.getSmeltingCostOfCurrentBar * 100);
        },
        //buildings
        getNumOfBuilding(state) {
            return (buildingId) => state.buildings[buildingId].owned;
        },
        //misc
        getCurrentSmeltingProgress(state) {
            return state.misc.currentSmeltingProgress;
        }
    },
    actions: {
        tick() {
            const cultists = useCultistsStore();

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

                for (var i in this.getSmelterArray) {
                    const cultist = cultists.getCultistById(this.getSmelterArray[i]);
                    cultist.addXp(this.getXpAmount("smelter"));
                }
            }
        },
        onBuild() {
            this.unlockResource("copperBars");
        },
        //resources
        instantiateResource(resourceObj) {
            this.resources.resources[resourceObj.id] = resourceObj;
            this.resources.locked.push(resourceObj.id);
        },
        modifyResource(resource, amount) {
            const resources = useResourcesStore();
            this.resources.resources[resource].total += amount;
        },
        setResourcePerSec(resource, amount) {
            this.resources.resources[resource].perSec = amount;
        },
        updateResources() {
            for (var i in this.resources.resources) {
                this.modifyResource(i, this.resources.resources[i].perSec);
            }
        },
        unlockResource(resourceId) {
            this.resources.locked = this.resources.locked.filter(val => val != resourceId);
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
        getSmelterModifier() {
            const cultists = useCultistsStore();

            const smelterArray = this.getSmelterArray;
            if (smelterArray.length < 1) {
                return 0;
            }

            var totalMod = 0;

            for (var i in smelterArray) {
                const smelter = cultists.getCultistById(smelterArray[i]);
                totalMod += smelter.getModifiers("smelter", null, 0.01);
            }

            return totalMod + 1;
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

            this.buildings = buildings["smelter"];
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