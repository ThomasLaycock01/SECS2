import { defineStore } from "pinia";


export const useTooltipsStore = defineStore('tooltips', {
    state: () => {
        return {
            activeTooltip: null
        }
    },
    getters: {
        getActiveTooltip(state) {
            return state.activeTooltip;
        }
    },
    actions: {
        setActiveTooltip(id) {
            this.activeTooltip = id;
        },
        removeActiveTooltip() {
            this.activeTooltip = null;
        }
    }
})