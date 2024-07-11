import { defineStore } from "pinia";

import { useExpansionsStore } from "./expansions";

export const useMiscStore = defineStore("misc", {
    state: () => {
        return {
            owned: {cultists: 0},
            limits: {cultists: 2},
            firstLoad: true,
            seenConvos:[]
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
        },
        getSeenConvos(state) {
            return state.seenConvos;
        },
        checkHasSeenConvo(state) {
            return (convoId) => state.seenConvos.includes(convoId);
        },
        checkFirstLoad(state) {
            return state.firstLoad;
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
        },
        calculateCultistLimit() {
            const expansions = useExpansionsStore();

            var totalLimit = 2;

            for (var i in expansions.getBuilt) {
                if (expansions.getBuilt[i]["cultistLimit"] != undefined) {
                    totalLimit += expansions.getBuilt[i]["cultistLimit"];
                }
            }

            this.limits.cultists = totalLimit;
        },
        addSeenConvo(convoId) {
            this.seenConvos.push(convoId);
        },
        setFirstLoadFalse() {
            this.firstLoad = false;
        }
    }
})