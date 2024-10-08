import { defineStore } from "pinia";

import { useResourcesStore } from "./resources";
import { useMinesStore } from "./mines"; 

import { posToNeg } from "@/functions";

export const useExpansionsStore = defineStore("expansions", {
    state: () => {
        return {built: {
            tier1: null,
            tier2: null,
            tier3: null
        },
        all: [
            {
                id: "mines", 
                name: "Mines", 
                tier: "tier1", 
                piniaObject() {
                    const mines = useMinesStore();
                    return mines;
                },
                costs: {
                    gold: 30
                }
            },
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
            return state.built.tier1;
        },
        getBuiltTier2Id(state) {
            return state.built.tier2;
        },
        getBuiltTier3Id(state) {
            return state.built.tier3;
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
            return (expansionId) => {
                const expansionObject = this.getObjectById(expansionId);
                if (state.built[expansionObject.tier] == expansionId) {
                    return true;
                }
                return false;
            };
        },
        getObjectById(state) {
            return (expansionId) =>  {
                for (var i in state.all) {
                    if (state.all[i].id == expansionId) {
                        return state.all[i];
                    }
                }
            }
        },
        getCostObject(state) {
            return (expansionId) => {
                for (var i in state.all) {
                    if (state.all[i].id === expansionId) {
                        return state.all[i].costs;
                    }
                }
                console.log("error in getCostObject funciton");

            }
        }
    },
    actions: {
        buildExpansion(expansionId) {

            const chosenExpansion = this.getObjectById(expansionId);
            const chosenTier = chosenExpansion.tier;
            this.built[chosenTier] = chosenExpansion.id;

            const costs = chosenExpansion.costs;

            const resources = useResourcesStore();

            for (var i in costs) {
                resources.modifyResource(i, posToNeg(costs[i]));
            }

        },
        expansionTicks() {
            for (var i in this.getBuilt) {
                if (this.getBuilt[i]) {
                    const pinia = this.getObjectById(this.getBuilt[i]).piniaObject();
                    pinia.tick();
                }
            }
        }/*,
        saveData() {
            var data = JSON.parse(localStorage.getItem("SECSData"));

            data.expansions = this["built"];

            localStorage.setItem("SECSData", JSON.stringify(data));
        },
        loadData() {
            var data = JSON.parse(localStorage.getItem("SECSData"));

            this["built"] = data.expansions;
        }*/
    }
})