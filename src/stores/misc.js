import { defineStore } from "pinia";

export const useMiscStore = defineStore("misc", {
    state: () => {
        return {
            defaultLevelLimit: 10
        }
    },
    getters: {
        getDefaultLevelLimit(state) {
            return state.defaultLevelLimit;
        }
    },
    actions: {
    }
})