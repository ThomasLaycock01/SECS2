import { defineStore } from "pinia";

import { useCultistsStore } from "./globalPinias/cultists";
import { useResourcesStore } from "./globalPinias/resources";
import { useExpansionsStore } from "./expansions";

import { beginSummoning, endSummoning } from "@/functions";

export const useMetalmancerStore = defineStore("metalmancer", {
    state: () => {
        return {
            actions: {
                expansions: {
                    id: "expansions",
                    name: "Expansions",
                    tooltipType: "expansion",
                    buttons: {
                        expansionGolemDissassembler: {
                            id: "expansionGolemDissassembler",
                            name: "T3 Expansion: Golem Dissassembler",
                            desc: "Begin dissassembling golems - their old body parts will retain a degree of sentience.",
                            costs() {
                                const expansions = useExpansionsStore();
                                return expansions.getCostObject("golemDissassembler");
                            },
                            condition() {
                                const expansions = useExpansionsStore();
                                const resources = useResourcesStore();
                                return resources.checkIfCanAfford(expansions.getCostObject("golemDissassembler"));
                            },
                            showCondition() {
                                const expansions = useExpansionsStore();
                                return !expansions.hasTier(3) && expansions.hasExpansion("metalmancer");
                            },
                            effect() {
                                const expansions = useExpansionsStore();
                                expansions.buildExpansion("golemDissassembler");
                            }
                        },
                        expansionTotems: {
                            id: "expansionTotems",
                            name: "T3 Expansion: Totems",
                            desc: "Build totems for global production bonuses",
                            costs() {
                                const expansions = useExpansionsStore();
                                return expansions.getCostObject("totems");
                            },
                            condition() {
                                const expansions = useExpansionsStore();
                                const resources = useResourcesStore();
                                return resources.checkIfCanAfford(expansions.getCostObject("totems"));
                            },
                            showCondition() {
                                const expansions = useExpansionsStore();
                                return !expansions.hasTier(3) && expansions.hasExpansion("metalmancer");
                            },
                            effect() {
                                const expansions = useExpansionsStore();
                                expansions.buildExpansion("totems");
                            }
                        }
                    }
                }
            },
            jobs: {
                metalmancer: {
                    id: "metalmancer",
                    cultistArray: [],
                    name: "Metalmancer",
                    xpOutput: 2,
                    limit: 3
                }
            },
            queues: {
                summoning: []
            },
            misc: {
                metalmancerLimit: 3,
                metalmancerJobName: "Metalmancer",
                currentSummoningProgress: 0,
                golemCosts: {
                    stone: {
                        stone: 500
                    },
                    copper: {
                        copper: 500,
                        stone: 250
                    },
                    iron: {
                        iron: 500,
                        copper: 250,
                        stone: 125
                    },
                    gold: {
                        gold: 4000
                    }
                }
            }
        }
    },
    getters: {
        //actions
        getActions(state) {
            return state.actions;
        },
        //jobs
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
        getMetalmancerArray(state) {
            return state.jobs.metalmancer.cultistArray;
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
        //queues
        getSummoningQueue(state) {
            return state.queues.summoning;
        },
        getCurrentSummoning(state) {
            return state.queues.summoning[0];
        },
        getCurrentSummoningPercentage() {
            return this.getCurrentSummoningProgress / this.getCurrentSummoning.summonCost * 100;
        },
        //misc
        getGolemCosts(state) {
            return (resource) => {
                return state.misc.golemCosts[resource];
            }
        },
        getCurrentSummoningProgress(state) {
            return state.misc.currentSummoningProgress;
        }
    },
    actions: {
        tick() {
            const cultists = useCultistsStore();

            if (this.getCurrentSummoning) {
                this.misc.currentSummoningProgress += 100 * this.getMetalmancerModifier();

                if (this.getCurrentSummoningProgress >= this.getCurrentSummoning.summonCost) {
                    this.misc.currentSummoningProgress -= this.getCurrentSummoning.summonCost;

                    this.endSummonGolem();
                }

                for (var i in this.getMetalmancerArray) {
                    const cultist = cultists.getCultistById(this.getMetalmancerArray[i]);
                    cultist.addXp(this.getXpAmount("metalmancer"));
                }
            }

            if (cultists.checkIfHasRacialGroup("golem")) {
                for (var i in this.getMetalmancerArray) {
                    const cultist = cultists.getCultistById(this.getMetalmancerArray[i]);
                    cultist.addXp(this.getXpAmount("metalmancer") / 2);
                }
            }
        },
        onBuild() {

        },
        //jobs
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
            console.log(jobId);
            console.log(cultistId);
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
        getMetalmancerModifier() {
            const cultists = useCultistsStore();

            if (this.getMetalmancerArray.length == 0) {
                return 0;
            }

            var totalMod = 1;

            for (var i in this.getMetalmancerArray) {
                const cultist = cultists.getCultistById(this.getMetalmancerArray[i]);
                totalMod += cultist.getModifiers("metalmancer", null, 0.1)
            }

            return totalMod;
        },
        //queues
        summonGolem(type) {
            const cultists = useCultistsStore();
            const resources = useResourcesStore();

            beginSummoning();

            console.log(type);

            const summonCosts = cultists.getRaceSummonCost(type);

            const queueObj = {
                golemType: type,
                summonCost: summonCosts
            };

            this.queues.summoning.push(queueObj);

            const costs = cultists.getRaceCosts(type);

            resources.removeResources(costs);

        },
        endSummonGolem() {
            endSummoning(this.getCurrentSummoning.golemType);

            this.queues.summoning.shift();
        }
    }
})