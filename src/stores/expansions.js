import { defineStore } from "pinia";

import { useResourcesStore } from "./resources";
import { useCostsStore } from "./costs";
import { useMinesStore } from "./mines"; 

import { posToNeg } from "@/functions";

export const useExpansionsStore = defineStore("expansions", {
    state: () => {
        return {built: {
            tier1: "",
            tier2: "",
            tier3: ""
        },
        all: [
            {id: "mines", name: "Mines", tier: "tier1", piniaObject() {
                const mines = useMinesStore();
                return mines;
            }},
            {id: "laboratory", name: "Laboratory", tier: "tier1"},
            {id: "barracks", name: "Barracks", tier: "tier2"},
            {id: "tower", name: "Tower", tier: "tier2"},
            {id: "academy", name: "Academy", tier: "tier3"},
            {id: "dungeons", name: "Dungeons", tier: "tier3"}
        ]
        }
    },
    getters: {
        getBuilt(state) {
            return state.built;
        },
        getBuiltTier1Id(state) {
            return state.built.tier1.id;
        },
        getBuiltTier2Id(state) {
            return state.built.tier2.id;
        },
        getBuiltTier3Id(state) {
            return state.built.tier3.id;
        },
        hasTier1(state) {
            return state.built.tier1 ? true : false;
        },
        hasTier2(state) {
            return state.built.tier2 ? true : false;
        },
        hasTier3(state) {
            return state.built.tier3 ? true : false;
        },
        checkIfBuilt(state) {
            return (expansionId, tier) => state.built[tier].id == expansionId ? true : false;
        },
        getObjectById(state) {
            return (expansionId) => state.all.filter((expansion) => expansion.id == expansionId)[0];
        }
    },
    actions: {
        buildExpansion(expansionId) {

            const chosenExpansion = this.all.filter(obj => obj.id == expansionId)[0];
            const chosenTier = chosenExpansion.tier;
            this.built[chosenTier] = chosenExpansion.id;



            const resources = useResourcesStore();
            const costs = useCostsStore();

            const cost = costs.getExpansionTierCost(chosenTier);

            for (var i in cost) {
                resources.modifyResource(i, posToNeg(cost[i]));
            }

        },
        checkIfCanAfford(expansionId) {
            const resources = useResourcesStore();
            const costs = useCostsStore();

            const chosenExpansion = this.all.filter(obj => obj.id == expansionId)[0];
            const chosenTier = chosenExpansion.tier;

            const cost = costs.getExpansionTierCost(chosenTier);

            var canAfford = true;

            for (var i in cost) {
                if (resources.getResourceTotal(i) < cost[i]) {
                    canAfford = false;
                }
            }

            return canAfford;
        },
        ExpansionTicks() {
            for (var i in this.getBuilt) {
                if (this.getBuilt[i]) {
                    const pinia = this.getObjectById(this.getBuilt[i]).piniaObject();
                    pinia.tick();
                }
            }
        },
        saveData() {
            var data = JSON.parse(localStorage.getItem("SECSData"));

            data.expansions = this["built"];

            localStorage.setItem("SECSData", JSON.stringify(data));
        },
        loadData() {
            var data = JSON.parse(localStorage.getItem("SECSData"));

            this["built"] = data.expansions;
        }
    }
})