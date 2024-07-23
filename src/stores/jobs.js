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
            this[jobId]["baseArray"].push(cultistId);
        },
        removeCultistFromJob(cultistId) {
            for (var i in this) {
                if (this[i]["baseArray"]) {
                    this[i]["baseArray"] = this[i]["baseArray"].filter((cultist) => cultist.getId() != cultistId);
                }
            }
        },
        saveData() {
            var data = JSON.parse(localStorage.getItem("SECSData"));

            const jobsObject = {};

            for (var i in this) {
                if (this[i]["baseArray"]) {
                    jobsObject[i] = {baseArray: this[i]["baseArray"]};
                }
            }

            data.jobs = jobsObject;

            localStorage.setItem("SECSData", JSON.stringify(data));
        },
        loadData() {
            var data = JSON.parse(localStorage.getItem("SECSData"));

            for (var i in data.jobs) {
                if (this[i]["baseArray"]) {
                    this[i]["baseArray"] = data.jobs[i]["baseArray"];
                }
            }
        }
    }
});