import { defineStore } from "pinia";

import { useResourcesStore } from "./globalPinias/resources";
import { useCultistsStore } from "./globalPinias/cultists";
import { useInventoryStore } from "./globalPinias/inventory";
import { useBuildingsStore } from "./globalPinias/buildings";

import { useExpansionsStore } from "./expansions";

import items from "../assets/json/items.json";
import buildings from "../assets/json/buildings.json";

export const useMinesStore = defineStore("mines", {
    state: () => {
        return {
            actions: {
                actions: {
                    id: "actions",
                    name: "Actions",
                    tooltipType: "action",
                    buttons : {
                        testButton: {
                            id: "testButton",
                            name: "Test button",
                            desc: "Hire a Human Cultist",
                            condition() {
                                return true;
                            },
                            showCondition() {
                                return true;
                            },
                            effect() {
                                const mines = useMinesStore();
                                mines.createItem(1000)
                            }
                        },
                        testButton2: {
                            id: "testButton2",
                            name: "Test button 2",
                            desc: "Hire a Human Cultist",
                            condition() {
                                return true;
                            },
                            showCondition() {
                                return true;
                            },
                            effect() {
                                const mines = useMinesStore();
                                mines.createItem(1001)
                            }
                        },
                        debugStone: {
                            id: "debugStone",
                            name: "Debug stone",
                            desc: "Hire a Human Cultist",
                            condition() {
                                return true;
                            },
                            showCondition() {
                                return true;
                            },
                            effect() {
                                const mines = useMinesStore();
                                mines.modifyResource("stone", 1000000)
                            }
                        },
                        debugCopper: {
                            id: "debugCopper",
                            name: "Debug copper",
                            desc: "Hire a Human Cultist",
                            condition() {
                                return true;
                            },
                            showCondition() {
                                return true;
                            },
                            effect() {
                                const mines = useMinesStore();
                                mines.modifyResource("copper", 1000000)
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
                },
                expansions: {
                    id: "expansions",
                    name: "Expansions",
                    tooltipType: "expansion",
                    buttons: {
                        expansionMetalmancer: {
                            id: "expansionMetalmancer",
                            name: "T2 Expansion: Metalmancer",
                            desc: "Build a tower for a Metalmancer.",
                            costs() {
                                const expansions = useExpansionsStore();
                                return expansions.getCostObject("metalmancer");
                            },
                            condition() {
                                const expansions = useExpansionsStore();
                                const resources = useResourcesStore();
                                return resources.checkIfCanAfford(expansions.getCostObject("metalmancer"));
                            },
                            showCondition() {
                                const expansions = useExpansionsStore();
                                return !expansions.hasTier(2) && expansions.hasExpansion("mines");
                            },
                            effect() {
                                const expansions = useExpansionsStore();
                                expansions.buildExpansion("metalmancer");
                            }
                        },
                        expansionForge: {
                            id: "expansionForge",
                            name: "T2 Expansion: Forge",
                            desc: "Build a forge for smithing gear.",
                            costs() {
                                const expansions = useExpansionsStore();
                                return expansions.getCostObject("forge");
                            },
                            condition() {
                                const expansions = useExpansionsStore();
                                const resources = useResourcesStore();
                                return resources.checkIfCanAfford(expansions.getCostObject("forge"));
                            },
                            showCondition() {
                                const expansions = useExpansionsStore();
                                return !expansions.hasTier(2) && expansions.hasExpansion("mines");
                            },
                            effect() {
                                const expansions = useExpansionsStore();
                                expansions.buildExpansion("forge");
                            }
                        }
                    }
                }
            },
            jobs: {
                mineOverseer: {
                    id: "mineOverseer",
                    cultistId: null,
                    name: "Mine Overseer",
                    xpOutput: 2,
                    isUnique: true
                },
                mineWorker: {
                    id: "mineWorker",
                    cultistArray: [],
                    limit: 5,
                    name: "Miner",
                    xpOutput: 1
                }
            },
            resources: {
                resources: {},
                locked: []
            },
            items: {
            },
            buildings: {
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
        getResourceConsumedPerSec(state) {
            return (id) => state.resources.resources[id].consumedPerSec;
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
        getOverseer(state) {
            if (state.jobs.mineOverseer.cultistId == null) {
                return null;
            }
            const cultists = useCultistsStore();
            return cultists.getCultistById(state.jobs.mineOverseer.cultistId);
        },
        getWorkerArray(state) {
            return state.jobs.mineWorker.cultistArray;
        },
        getNumOfWorkers(state) {
            return state.jobs.mineWorker.cultistArray.length;
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
        //items
        getItems(state) {
            return state.items;
        },
        //buildings
        getNumOfBuilding(state) {
            return (buildingId) => state.buildings[buildingId].owned;
        }
    },
    actions: {
        //tick
        tick() {
            //pinia stores
            const cultists = useCultistsStore();
            const buildings = useBuildingsStore();
            const resources = useResourcesStore();
            //first - get overseer modifier
            const overseerMod = this.getOverseerModifier();

            //second - calculate output of each resource
            for (var i in this.getAll) {
                var resourceOutput = 0;
                for (var j in this.getWorkerArray) {
                    if (this.getWorkerArray[j].resource == i) {
                        
                        const cultist = cultists.getCultistById(this.getWorkerArray[j].cultistId);
                        //output 
                        const cultistMod = cultist.getModifiers("mineWorker", i, 0.1);
                        const buildingMod = buildings.getBuildingModifier("mineWorker", i);
                        const finalMod = 1 + cultistMod + buildingMod;

                        resourceOutput += 1 * finalMod;
                    }
                }
                if (i == "goldProd") {
                    resources.setResourcePerSec("gold", Math.round(resourceOutput * overseerMod * 100) / 100);
                }
                else {
                    this.setResourcePerSec(i, Math.round(resourceOutput * overseerMod * 100) / 100);
                }
            }
            resources.updateResources();
            this.updateResources();

            //scavenge stuff
            if (this.getResourceTotal("scavenge") >= 100) {
                this.resources["scavenge"].total -= 100;
                this.completeScavenge();
            }

            //adding XP
            for (var i in this.getWorkerArray) {
                const cultist = cultists.getCultistById(this.getWorkerArray[i].cultistId);
                cultist.addXp(this.getXpAmount("mineWorker"));
            }

            if (this.getOverseer && this.getNumOfWorkers > 0) {
                const overseer = this.getOverseer;
                overseer.addXp(this.getXpAmount("mineOverseer"));
            }

        },
        //onBuilt
        onBuild() {
            this.unlockResource("stone");
        },
        //resources
        instantiateResource(resourceObj) {
            this.resources.resources[resourceObj.id] = resourceObj;
            if (resourceObj.id != "goldProd") {
                this.resources.locked.push(resourceObj.id);
            }
        },
        modifyResource(resource, amount) {
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
        //items
        instantiateItems() {
            this.items = items.mines;
        },
        createItem(itemId) {
            const inventory = useInventoryStore();
            const object = this.items[itemId];
            inventory.addItem(object);
        },
        giveRandItem(tier) {
            var tierArray = [];
            for (var i in this.getItems) {
                if (this.getItems[i].tier == tier) {
                    tierArray.push(this.getItems[i]);
                }
            }

            const index = Math.floor(Math.random() * tierArray.length)

            this.createItem(tierArray[index].itemId);
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
                this.jobs[jobId].cultistArray = this.jobs[jobId].cultistArray.filter(obj => obj.cultistId != cultistId);
            }
        },
        switchResource(cultistId, newResourceId) {
            for (var i in this.jobs.mineWorker.cultistArray) {
                if (this.jobs.mineWorker.cultistArray[i].cultistId == cultistId) {
                    this.jobs.mineWorker.cultistArray[i].resource = newResourceId;
                }
            }
        },
        getOverseerModifier() {
            const overseer = this.getOverseer;
            if (overseer == null) {
                return 0.5;
            }

            return overseer.getModifiers("mineOverseer", null, 0.1) + 1;
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

            this.buildings = buildings["mines"];
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
        },
        //misc
        completeScavenge() {
            const index = Math.random();

            if (index >= 0.9) {
                this.giveRandItem(1);
            }
            else {
                this.giveRandItem(0);
            }
        }
    }
})