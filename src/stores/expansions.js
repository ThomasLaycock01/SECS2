import { defineStore } from "pinia";

export const useExpansionsStore = defineStore("expansions", {
    state: () => {
        return {built: {
            tier0: {},
            tier1: {},
            tier2: {}
        },
        all: [
            {id: "laboratory", name: "Laboratory", tier: "tier0"}
        ]
        }
    },
    getters: {
        getBuiltTier0(state) {
            return state.built.tier0;
        },
        getBuiltTier1(state) {
            return state.built.tier1;
        },
        getBuiltTier2(state) {
            return state.built.tier2;
        },
        hasTier0(state) {
            return state.built.tier0.id ? true : false;
        },
        hasTier1(state) {
            return state.built.tier1.id ? true : false;
        },
        hasTier2(state) {
            return state.built.tier2.id ? true : false;
        }
    },
    actions: {
        buildExpansion(expansionId) {
            const chosenExpansion = this.all.filter(obj => obj.id == expansionId)[0];
            const chosenTier = chosenExpansion.tier;
            this.built[chosenTier] = chosenExpansion;
        }
    }
})