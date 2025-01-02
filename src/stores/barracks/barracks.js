import { defineStore } from "pinia";


export const useBarracksStore = defineStore("barracks", {
    state: () => {
        return {
            jobs: {
                knight: {
                    id: "knight",
                    cultistArray: [],
                    limit: 0,
                    name: "Knight"
                },
                mage: {
                    id: "mage",
                    cultistArray: [],
                    limit: 0,
                    name: "Mage"
                },
                healer: {
                    id: "healer",
                    cultistArray: [],
                    limit: 0,
                    name: "Healer"
                }
                
            },
            misc: {
                partyLimit: 3
            }
        }
    },
    getters: {
        //jobs
        getJobs(state) {
            return state.jobs;
        },
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
        //misc
        getPartySize(state) {
            var totalRoles = 0;

            for (var i in state.jobs) {
                totalRoles += state.jobs[i].limit;
            }

            return totalRoles;
        },
        getPartyLimit(state) {
            return state.misc.partyLimit;
        },
        checkIfPartySpace(state) {
            return state.getPartySize < state.getPartyLimit;
        }
    },
    actions: {
        tick() {

        },
        onBuild() {
            
        },
        //party
        addRole(role) {
            this.jobs[role].limit += 1;
        },
        removeRole(role) {
            this.jobs[role].limit -= 1;
        },
        removeAllRole(role) {
            this.jobs[role].limit = 0;
        },
        //jobs
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
        }
    }
})