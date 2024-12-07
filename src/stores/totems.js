import { defineStore } from "pinia"

import { useCultistsStore } from "./globalPinias/cultists";
import { useResourcesStore } from "./globalPinias/resources";

export const useTotemsStore = defineStore("totems", {
    state: () => {
        return {
            actions: {

            },
            jobs: {
                caretaker: {
                    id: "caretaker",
                    cultistArray: [],
                    name: "Totem Caretaker",
                    xpOutput: 2,
                    limit: 1
                }
            },
            queues: {

            },
            items: {

            },
            totems: {
                stone: {
                    id: "stone",
                    name: "Monolith",
                    modifiers: [{type: "mineWorker", altType: "stone", modifier: 0.2}],
                    effectDesc: "+5% stone output per level",
                    costs: {stone: 50000},
                    increment: 2,
                    level: 0,
                    maxLevel: 3
                }
            },
            misc: {
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
        getJobArray(state) {
            return (jobId) => {
                return state.jobs[jobId].cultistArray;
            }
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
        getDissassemblyQueue(state) {
            return state.queues.dissassembly;
        },
        getCurrentDissassembly(state) {
            return state.queues.dissassembly[0];
        },
        getCurrentDissassemblyPercentage() {
            return this.getCurrentDissassemblyProgress / 1000 * 100;
        },
        //items
        getItemById(state) {
            return (itemId) => {
                return state.items[itemId];
            }
        },
        //totems
        getTotems(state) {
            return state.totems;
        },
        getTotemCost(state) {
            return (totemId) => {
                const returnObj = {};

                for (var i in state.totems[totemId].costs) {
                    returnObj[i] = state.totems[totemId].costs[i] * Math.pow(state.totems[totemId].increment, state.totems[totemId].level);
                }

                return returnObj;
            }
        },
        checkIfCanAffordTotem(state) {
            return (totemId) => {
                const resources = useResourcesStore();

                const costObj = state.getTotemCost(totemId);
    
                return resources.checkIfCanAfford(costObj);
            }
        },
        checkIfTotemUpgradeAvailable(state) {
            return (totemId) => {
                return state.checkIfCanAffordTotem(totemId) && state.totems[totemId].level + 1 <= state.totems[totemId].maxLevel;
            }
        },
        getTotemModifiers(state) {
            return (type, altType) => {
                const returnArray = [];
                
                //iterate over every totem
                for (var i in state.totems) {
                    //iterate over every modifier
                    for (var j in state.totems[i].modifiers) {
                        const modifierObj = state.totems[i].modifiers[j];


                        //THIS IS A HACK - it only works cause totems rn only affect mine output - will probably need changing later
                        if (modifierObj.type == type && (modifierObj.altType == altType || altType == null)) {
                            const objToAdd = {modifier: modifierObj.modifier * state.totems[i].level};

                            returnArray.push(objToAdd)
                        }
                    }
                }
                return returnArray;
            }
        },
        //misc
        getCurrentDissassemblyProgress(state) {
            return state.misc.currentDissassemblyProgress;
        }
    },
    actions: {
        tick() {

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
        //totems
        upgradeTotem(totemId) {
            const resources = useResourcesStore();

            const costs = this.getTotemCost(totemId);

            resources.removeResources(costs);

            this.totems[totemId].level++;
        }
    }
})