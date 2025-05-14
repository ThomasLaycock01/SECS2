import { defineStore } from "pinia";


export const useStatsStore = defineStore("stats",{
    state: () => {
        return {
            ticks: 0
        }
    },
    getters: {
        getTickCount(state) {
            return state.ticks;
        }
    },
    actions: {
        tick() {
            this.ticks++;
        }
    }
})