import {defineStore} from "pinia";

import { useCultistsStore } from "./cultists";

export const useJobsStore = defineStore("jobs", {
    state: () => {
        return {miner: {output: 1, name:"Gold Miner", array: []}}
    },
    getters: {
        getMiners(state) {
            return state.miner.array;
        }
    },
    actions: {
        addCultistToJob(cultistId, job) {
            const cultists = useCultistsStore();
            const cultist = cultists.getCultistById(cultistId);
            this[job].array.push(cultist);
        }
    }
});