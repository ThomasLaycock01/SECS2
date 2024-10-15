import { defineStore } from "pinia";

export const useMetalmancerStore = defineStore("metalmancer", {
    state: () => {
        return {

        }
    },
    getters: {
        //actions
        getActions(state) {
            return state.actions;
        }
    },
    actions: {
        tick() {
            console.log("metalmancer tick")
        }
    }
})