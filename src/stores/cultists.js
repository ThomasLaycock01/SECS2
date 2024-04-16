import {defineStore} from "pinia";

export const useCultistsStore = defineStore("cultists", {
    state: () => {
        return []
    },
    getters: {
        numOfCultists(state) {
            if (state.length == undefined) {
                return 0;
            }
            return state.length;
        }
    }
});