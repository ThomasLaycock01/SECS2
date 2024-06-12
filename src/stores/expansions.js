import { defineStore } from "pinia";

import { useResourcesStore } from "./resources";

import { posToNeg } from "@/functions";

export const useExpansionsStore = defineStore("expansions", {
    state: () => {
        return {built: {
            tier0: {},
            tier1: {},
            tier2: {}
        },
        all: [
            {id: "mines", name: "Mines", tier: "tier1", costs: {Gold: 30}, cultistLimit: 2},
            {id: "laboratory", name: "Laboratory", tier: "tier1", costs: {Gold: 30}, cultistLimit: 2},
            {id: "barracks", name: "Barracks", tier: "tier2", costs: {Gold: 100, Crystals: 100}, cultistLimit: 2},
            {id: "tower", name: "Tower", tier: "tier2", costs: {Gold: 50, Crystals: 200}, cultistLimit: 2},
            {id: "academy", name: "Academy", tier: "tier3", costs: {Gold: 50000, Crystals: 10000}, cultistLimit: 2},
            {id: "dungeons", name: "Dungeons", tier: "tier3", costs: {Gold: 100000, Crystals: 5000}, cultistLimit: 2}
        ]
        }
    },
    getters: {
        getBuilt(state) {
            return state.built;
        },
        getBuiltTier0Id(state) {
            return state.built.tier0.id;
        },
        getBuiltTier1Id(state) {
            return state.built.id;
        },
        getBuiltTier2Id(state) {
            return state.built.tier2.id;
        },
        hasTier0(state) {
            return state.built.tier0.id ? true : false;
        },
        hasTier1(state) {
            return state.built.tier1.id ? true : false;
        },
        hasTier2(state) {
            return state.built.tier2.id ? true : false;
        },
        checkIfBuilt(state) {
            return (expansionId, tier) => state.built[tier].id == expansionId ? true : false;
        }
    },
    actions: {
        buildExpansion(expansionId) {
            const chosenExpansion = this.all.filter(obj => obj.id == expansionId)[0];
            const chosenTier = chosenExpansion.tier;
            this.built[chosenTier] = chosenExpansion;

            const resources = useResourcesStore();
            for (var i in chosenExpansion.costs) {
                resources.modifyResource(i, posToNeg(chosenExpansion.costs[i]));
            }

        },
        checkIfCanAfford(expansionId) {
            const resources = useResourcesStore();

            const chosenExpansion = this.all.filter(obj =>  obj.id == expansionId)[0]

            var canAfford = true;

            for (var i in chosenExpansion.costs) {
                if (resources.getResourceTotal(i) < chosenExpansion.costs[i]) {
                    canAfford = false;
                }
            }

            return canAfford;
        }
    }
})