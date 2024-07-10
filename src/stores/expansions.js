import { defineStore } from "pinia";

import { useResourcesStore } from "./resources";
import { useCostsStore } from "./costs";

import { posToNeg } from "@/functions";

export const useExpansionsStore = defineStore("expansions", {
    state: () => {
        return {built: {
            tier1: {},
            tier2: {},
            tier3: {}
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
            return state.built.tier1.id;
        },
        getBuiltTier2Id(state) {
            return state.built.tier2.id;
        },
        getBuiltTier3Id(state) {
            return state.built.tier3.id;
        },
        hasTier1(state) {
            return state.built.tier1.id ? true : false;
        },
        hasTier2(state) {
            return state.built.tier2.id ? true : false;
        },
        hasTier3(state) {
            return state.built.tier3.id ? true : false;
        },
        checkIfBuilt(state) {
            return (expansionId, tier) => state.built[tier].id == expansionId ? true : false;
        },
        getExpansionCosts(state) {
            return (expansionId) => state.all.filter((expansion) => expansion.id == expansionId)[0].costs;
        }
    },
    actions: {
        buildExpansion(expansionId) {

            const chosenExpansion = this.all.filter(obj => obj.id == expansionId)[0];
            const chosenTier = chosenExpansion.tier;
            this.built[chosenTier] = chosenExpansion;



            const resources = useResourcesStore();
            const costs = useCostsStore();

            const cost = costs.getExpansionCost(expansionId);

            for (var i in cost) {
                resources.modifyResource(i, posToNeg(cost[i]));
            }

        },
        checkIfCanAfford(expansionId) {
            const resources = useResourcesStore();
            const costs = useCostsStore();

            const cost = costs.getExpansionCost(expansionId);

            var canAfford = true;

            for (var i in cost) {
                if (resources.getResourceTotal(i) < cost[i]) {
                    canAfford = false;
                }
            }

            return canAfford;
        }
    }
})