import { defineStore } from "pinia";

import { useCultistsStore } from "./globalPinias/cultists";
import { useResourcesStore } from "./globalPinias/resources";

import { beginSummoning, endSummoning } from "@/functions";

export const useMetalmancerStore = defineStore("metalmancer", {
    state: () => {
        return {
            actions: {
                actions: {
                    id: "actions",
                    name: "Actions",
                    tooltipType: "action",
                    buttons : {
                        placeholder: {
                            id: "placeholder",
                            name: "placeholder",
                            desc: "Be Evil - and Gain 1 Evilness",
                            condition() {
                                return true;
                            },
                            showCondition() {
                                return true;
                            },
                            effect() {
                               return true;
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
            if (this.getCurrentSummoning) {
                this.misc.currentSummoningProgress += 100 * this.getMetalmancerModifier();

                if (this.getCurrentSummoningProgress >= this.getCurrentSummoning.summonCost) {
                    this.misc.currentSummoningProgress -= this.getCurrentSummoning.summonCost;

                    this.endSummonGolem();
                }
            }
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

            if (this.workers.metalmancer.length == 0) {
                return 0;
            }

            var totalMod = 1;

            for (var i in this.workers.metalmancer) {
                const cultist = cultists.getCultistById(this.workers.metalmancer[i]);
                totalMod += cultist.getModifiers("metalmancer", null, 0.1)
            }

            return totalMod;
        },
        //queues
        summonGolem(type) {

            beginSummoning();

            const queueObj = {
                golemType: type,
                summonCost: 1000
            };

            this.queues.summoning.push(queueObj);

        },
        endSummonGolem() {
            const resources = useResourcesStore();

            const resourceName = resources.getName(this.getCurrentSummoning.golemType);

            const golemSpecies = `${resourceName} Golem`;

            endSummoning(golemSpecies);

            this.queues.summoning.shift();
        }
    }
})