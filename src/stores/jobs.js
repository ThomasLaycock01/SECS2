import {defineStore} from "pinia";

import { useCultistsStore } from "./cultists";



export const useJobsStore = defineStore("jobs", {
    state: () => {
        return {
            Gold: {miner: {output: 1, limit: 0, name:"Gold Miner", array: [], stat: "str"}},
            Evilness: {},
            Crystals: {}
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
        }
    }
});