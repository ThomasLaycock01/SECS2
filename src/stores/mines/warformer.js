import { defineStore } from "pinia";

import { useCultistsStore } from "../globalPinias/cultists";
import { useExpansionsStore } from "../globalPinias/expansions";
import { useResourcesStore } from "../globalPinias/resources";

import { beginSummoning, endSummoning } from "@/functions";

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
                summoning: []
            },
            buildings: {
            },
            misc: {
                currentSummoningProgress: 0
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
        getJobModifier(state) {
            return (jobId) => {
                if (state.jobs[jobId].cultistArray.length == 0) {
                    return 0;
                }

                const cultists = useCultistsStore();

                var totalMod = 0;

                for (var i in state.jobs[jobId].cultistArray) {
                    const cultist = cultists.getCultistById(state.jobs[jobId].cultistArray[i]);
                    totalMod += cultist.getModifiers(jobId, null, 0.1)
                }

                return totalMod;
            }
        },
        getWarformerArray(state) {
            return state.jobs.warformer.cultistArray;
        },
        //queues
        getQueue(state) {
            return state.queues.summoning;
        },
        getCurrentSummoning(state) {
            return state.queues.summoning[0];
        },
        getCurrentSummoningPercentage() {
            return Math.round(this.getCurrentSummoningProgress / this.getCurrentSummoning.summonCost * 100);
        },
        //misc
        getCurrentSummoningProgress(state) {
            return state.misc.currentSummoningProgress;
        }
    },
    actions: {
        tick() {
            const cultists = useCultistsStore();

            if (this.getCurrentSummoning) {
                this.misc.currentSummoningProgress += 100 * this.getWarformerModifier();

                if (this.getCurrentSummoningProgress >= this.getCurrentSummoning.summonCost) {
                    this.misc.currentSummoningProgress -= this.getCurrentSummoning.summonCost;

                    this.endSummonWarform();
                }

                for (var i in this.getWarformerArray) {
                    const cultist = cultists.getCultistById(this.getWarformerArray[i]);
                    cultist.addXp(this.getXpAmount("warformer"));
                }
            }

            
            if (cultists.checkIfHasRacialGroup("warform")) {
                for (var i in this.getWarformerArray) {
                    const cultist = cultists.getCultistById(this.getWarformerArray[i]);
                    cultist.addXp(this.getXpAmount("metalmancer") / 2);
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
        getWarformerModifier() {
            const cultists = useCultistsStore();

            const warformerArray = this.getWarformerArray;
            if (warformerArray.length < 1) {
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
        summonWarform(type) {
            const cultists = useCultistsStore();
            const resources = useResourcesStore();

            beginSummoning();

            console.log(type);

            const summonCosts = cultists.getRaceSummonCost(type);

            const queueObj = {
                warformType: type,
                summonCost: summonCosts
            };

            this.queues.summoning.push(queueObj);

            const costs = cultists.getRaceCosts(type);

            resources.removeResources(costs);

        },
        endSummonWarform() {
            endSummoning(this.getCurrentSummoning.warformType);

            this.queues.summoning.shift();
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