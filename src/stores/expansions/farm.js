import { defineStore } from "pinia";


export const useFarmStore = defineStore("farm", {
    state: () => {
        return {
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
                }
            },
            jobs: {
                farmer: {
                    id: "farmer",
                    cultistArray: [],
                    limit: 4,
                    name: "Farmer",
                    xpOutput: 2
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
        getNumOfWorkers(state) {
            return (jobId) => {
                return state.jobs[jobId].cultistArray.length;
            }
        },
        getJobLimit(state) {
            return (jobId) => {
                return state.jobs[jobId].limit;
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
        }
    },
    actions: {
        tick() {

        },
        onBuild() {

        },
        addToJob(jobId, cultist) {
            cultist.setJob(this.jobs[jobId].name);

            this.jobs[jobId].cultistArray.push(cultist);
        },
        removeFromJob(jobId, cultist) {
            this.jobs[jobId].cultistArray = this.jobs[jobId].cultistArray.filter(obj => obj.getId() != cultist.getId());
        }
    }
})