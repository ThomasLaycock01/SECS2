import {defineStore} from "pinia";

import { useCultistsStore } from "./cultists";
import { useBuildingsStore } from "./buildings";

export const useJobsStore = defineStore("jobs", {
    state: () => {
        return {
            //mines
            goldMiner: {
                id: "goldMiner",
                name: "Gold Miner",
                output: "Gold",
                stat: "str",
                baseArray: [],
                modifiers: [{name: "Buildings", modifier() {
                    const buildings = useBuildingsStore();
                    return 1 + (buildings.getNumOfBuildingById("goldMine") - 1) * 0.2;
                }}],
                requirement() {
                    const buildings = useBuildingsStore();
                    return buildings.getNumOfBuildingById("goldMine") >= 1;
                }
            },
            crystalMiner: {
                id: "crystalMiner",
                name: "Crystal Miner",
                output: "Crystals",
                stat: "str",
                baseArray: [],
                modifiers: [{name: "Buildings", modifier() {
                    const buildings = useBuildingsStore();
                    return 1 + (buildings.getNumOfBuildingById("crystalMine") - 1) * 0.2;
                }}],
                requirement() {
                    const buildings = useBuildingsStore();
                    return buildings.getNumOfBuildingById("crystalMine") >= 1;
                }
            }

        }
    },
    getters: {
        getAll(state) {
            return state;
        },
        getById(state) {
            return (id) => state[id];
        },
        getAssociatedStat(state) {
            return (id) => state[id]["stat"];
        },
        getName(state) {
            return (id) => state[id]["name"];
        },
        getBaseArray(state) {
            return (id) => state[id]["baseArray"];
        }
        /*getArray(state) {
            return (resource, job) => state[resource][job]["array"];
        },
        getOutput(state) {
            return (resource, job) => state[resource][job]["output"];
        },
        getName(state) {
            return (resource, job) => state[resource][job]["name"];
        },
        getReqExpansion(state) {
            return (resource, job) => state[resource][job]["reqExpansion"];
        },
        getTier(state) {
            return (resource, job) => state[resource][job]["tier"];
        }*/
    },
    actions: {
        getByOutput(output) {
            var returnArray = [];
            for (var i in this) {
                if (this[i]["output"] == output) {
                    returnArray.push(this[i])
                }
            }

            return returnArray;
        },
        addCultistToJob(cultistId, jobId) {
            const cultists = useCultistsStore();
            const cultist = cultists.getCultistById(cultistId);
            this[jobId]["baseArray"].push(cultist);
        },
        removeCultistFromJob(cultistId) {
            for (var i in this) {
                if (this[i]["baseArray"]) {
                    this[i]["baseArray"] = this[i]["baseArray"].filter((cultist) => cultist.getId() != cultistId);
                }
            }
        }
        /*
        removeCultistfromJob(cultistId) {
            //doing it like this just cause a cultist can only have 1 job, so just make sure it's not in any of the arrays
            for (var i in this) {
                for (var j in this[i]) {
                    if (this[i][j]["array"]) {
                        const newArray = this[i][j]["array"].filter((cultist) => cultist.getId() != cultistId);
                        this[i][j]["array"] = newArray;
                    }
                }
            }
        },
        checkIfHasReqExapansion(expansion, tier) {
            const expansions = useExpansionsStore();

            //const expansion = this.getReqExpansion(prodType, jobId);
            //const tier = this.getTier(prodType, jobId);

            return expansions.checkIfBuilt(expansion, tier);

        }*/
    }
});