import { defineStore } from "pinia";

export const useMiscStore = defineStore("misc", {
    state: () => {
        return {
            owned: {cultists: 0, buildings: 0},
            limits: {cultists: 2, buildings: 2}
        }
    },
    getters: {
        getCultistLimit(state) {
            return state.limits.cultists;
        },
        getCultistOwned(state) {
            return state.owned.cultists;
        },
        getBuildingsLimit(state) {
            return state.limits.cultists;
        },
        checkCultistSpace(state) {
            return state.limits.cultists > state.owned.cultists;
        },
        checkBuildingSpace(state) {
            return state.limits.buildings > state.owned.buildings;
        }
    },
    actions: {
        addCultist() {
            this.owned.cultists += 1;
        },
        addBuilding() {
            this.owned.buildings += 1;
        },
        removeCultist() {
            this.owned.cultists -= 1;
        },
        removeBuilding() {
            this.owned.buildings -= 1;
        }
    }
})