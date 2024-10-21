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
            },
            items: {
            },
            buildings: {

            },
            misc: {
                workerJobName: "Miner",
                overseerJobName: "Mine Overseer",
                workerXp: 1,
                overseerXp: 2
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
        getResourceConsumedPerSec(state) {
            return (id) => state.resources[id].consumedPerSec;
        },
        getUnlockedResources(state) {
            const returnArray = [];
            for (var i in state.resources) {
                returnArray.push(state.resources[i]);
            }

            return returnArray;   
            //kind cheating here, but for now this will just return everything
            /*return (properties = null) => {
                const returnArray = [];

                for (var i in state.resources) {
                    if (properties) {
                        for (var j in properties) {
                            if (properties[j] === state.resources[i].properties[j] && state.resources[i].unlockCondition()) {
                                returnArray.push(state.resources[i]);
                            }
                        }
                    }
                    else {
                        if (state.resources[i].unlockCondition()) {
                            returnArray.push(state.resources[i]);
                        }
                    }
                }

                return returnArray;
            }*/
        },
        getResourcesByProperties(state) {
            return (properties) => {
                const returnArray = [];

                for (var i in state.resources) {
                    for (var j in properties) {
                        if (properties[j] === state.resources[i].properties[j]) {
                            returnArray.push(state.resources[i]);
                        }
                    }
                }

                return returnArray;
            }
        },
        getResourceName(state) {
            return (id) => state.resources[id].name;
        },
        getResourceProperties(state) {
            return (id) => state.resources[id].properties;
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
        //items
        getItems(state) {
            return state.items;
        },
        //buildings
        getNumOfBuilding(state) {
            return (buildingId) => state.buildings[buildingId].owned;
        },
        //misc
        getWorkerJobName(state) {
            return state.misc.workerJobName;
        },
        getOverseerJobName(state) {
            return state.misc.overseerJobName;
        },
        getWorkerXpAmount(state) {
            return state.misc.workerXp;
        },
        getOverseerXpAmount(state) {
            return state.misc.overseerXp;
        }
    },
    actions: {
        //tick
        tick() {
            //pinia stores
            const cultists = useCultistsStore();
            const buildings = useBuildingsStore();
            //first - get overseer modifier
            const overseerMod = this.getOverseerModifier();

            //second - calculate output of each resource
            for (var i in this.getResources) {
                var resourceOutput = 0;
                for (var j in this.getWorkerArray) {
                    if (this.getWorkerArray[j].resource == i) {
                        const cultist = cultists.getCultistById(this.getWorkerArray[j].cultistId);
                        //output 
                        const cultistMod = cultist.getModifiers("mineWorker", i, 0.1);
                        const buildingMod = buildings.getGlobalBuildingJobModifier("mineWorker") + buildings.getSpecificBuildingJobModifier("mineWorker", i);
                        const finalMod = 1 + cultistMod + buildingMod;

                        resourceOutput += 1 * finalMod;
                    }
                }
                this.setResourcePerSec(i, Math.round(resourceOutput * overseerMod * 100) / 100);
            }

            this.updateResources();

            //scavenge stuff
            if (this.getResourceTotal("scavenge") >= 100) {
                this.resources["scavenge"].total -= 100;
                this.completeScavenge();
            }

            //adding XP
            for (var i in this.getWorkerArray) {
                const cultist = cultists.getCultistById(this.getWorkerArray[i].cultistId);
                cultist.addXp(this.getWorkerXpAmount);
            }

            if (this.getOverseer && this.getNumOfWorkers > 0) {
                const overseer = this.getOverseer;
                overseer.addXp(this.getOverseerXpAmount);
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
        updateResources() {
            for (var i in this.resources) {
                this.modifyResource(i, this.resources[i].perSec);
            }
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
            else if (cultistId) {
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
                this.jobs[jobId].cultistArray = this.jobs[jobId].cultistArray.filter(obj => obj.cultistId == cultistId);
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
            for (var i in this.buildings[buildingId].costs) {
                this.buildings[buildingId].costs[i] = this.buildings[buildingId].costs[i] * this.buildings[buildingId].exponents[i]
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
                    owned() {
                        const buildings = useBuildingsStore();
                        return buildings.getNumOfBuildings(buildingObj["id"]);
                    },
                    costs() {
                        return buildingObj["costs"];
                    },
                    condition() {
                        const resources = useResourcesStore();
                        return resources.checkIfCanAfford(buildingObj["costs"]);
                    },
                    showCondition() {
                        const resources = useResourcesStore();
                        const expansions = useExpansionsStore();
                        return resources.getEvilness >= buildingObj["reqs"]["evilness"] && expansions.hasTier(buildingObj["reqs"]["expansionTier"]);
                    },
                    effect() {
                        const buildings = useBuildingsStore();
                        buildings.buildBuildings(id, buildingObj["id"]);
                    }
                }
            }
        },
        //saving/loading
        /*saveData() {
            var data = JSON.parse(localStorage.getItem("SECSData"));

            data.mines = this.workers;

            localStorage.setItem("SECSData", JSON.stringify(data));
        },
        loadData() {
            var data = JSON.parse(localStorage.getItem("SECSData"));

            this.workers = data.mines;
        },*/
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