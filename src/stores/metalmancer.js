import { defineStore } from "pinia";

import { useCultistsStore } from "./globalPinias/cultists";

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
        //misc
        getGolemCosts(state) {
            return (resource) => {
                return state.misc.golemCosts[resource];
            }
        }
    },
    actions: {
        tick() {
            console.log("metalmancer tick")
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
        }
    }
})