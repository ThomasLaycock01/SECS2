import {defineStore} from "pinia";

import { useCultistsStore } from "./cultists";



export const useJobsStore = defineStore("jobs", {
    state: () => {
        return {
            Gold: {miner: {output: 1, name:"Gold Miner", array: []}
            }}
    },
    getters: {
        getMiners(state) {
            return state.Gold.miner.array;
        },
        getByProdType(state) {
            return (prodType) => state[prodType];
        }
    },
    actions: {
        addCultistToJobArray(cultistId, prodType, job) {
            const cultists = useCultistsStore();
            const cultist = cultists.getCultistById(cultistId);
            this[prodType][job].array.push(cultist);
        }
    }
});