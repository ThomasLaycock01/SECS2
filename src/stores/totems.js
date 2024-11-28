import { defineStore } from "pinia"

import { useCultistsStore } from "./globalPinias/cultists";

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
    }
})