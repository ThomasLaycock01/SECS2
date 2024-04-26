import {defineStore} from "pinia";

import { useCultistsStore } from "./cultists";



export const useJobsStore = defineStore("jobs", {
    state: () => {
        return {
            Gold: {miner: {id: "miner", output: 1, limit: 0, name:"Gold Miner", array: [], stat: "str"}, alchemist: {id: "alchemist", output: 1, limit: 0, name: "Alchemist", array: [], stat: "int"}},
            Crystals: {miner: {id: "miner", output: 1, limit: 0, name: "Crystal Miner", array: [], stat: "str"}}
        }
    },
    getters: {
        getAll(state) {
            return state;
        },
        getByProdType(state) {
            return (prodType) => state[prodType];
        },
        getAssociatedStat(state) {
            return (resource, job) => state[resource][job]["stat"];
        },
        getArray(state) {
            return (resource, job) => state[resource][job]["array"];
        },
        getOutput(state) {
            return (resource, job) => state[resource][job]["output"];
        },
        getName(state) {
            return (resource, job) => state[resource][job]["name"]
        }
    },
    actions: {
        addCultistToJobArray(cultistId, prodType, job) {
            const cultists = useCultistsStore();
            const cultist = cultists.getCultistById(cultistId);
            this[prodType][job].array.push(cultist);
        },
        checkIfAtLimit(resource, job) {
            const array = this[resource][job]["array"];
            if (array.length > this[resource][job]["limit"]) {
                return true;
            }
            else {
                return false;
            }
        },
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
        }
    }
});