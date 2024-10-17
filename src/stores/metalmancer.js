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
            workers: {
                metalmancer: []
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
        //workers
        getMetalmancers(state) {
            const cultists = useCultistsStore();
            const returnArray = [];

            for (var i in state.workers.metalmancer) {
                returnArray.push(cultists.getCultistById(state.workers.metalmancer[i]));
            }

            return returnArray;
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
        //workers
        assignOther(cultistId, jobId) {
            switch (jobId) {
                case "metalmancer":
                    this.workers.metalmancer.push(cultistId);
                    return this.misc.metalmancerJobName;
                default:
                    console.log("error in metalmancer.assignOther")
            }
        },
        removeOther(jobId, cultistId) {
            switch(jobId) {
                case "metalmancer":
                    this.workers.metalmancer = this.workers.metalmancer.filter(obj => obj != cultistId);
                    break;
                default:
                    console.log("error in metalmancer.removeOther")
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
                totalMod += cultist.getGlobalModifiers("metalmancer")
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