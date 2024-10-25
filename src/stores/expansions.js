import { defineStore } from "pinia";

import { useResourcesStore } from "./globalPinias/resources";
import { useMinesStore } from "./mines"; 
import { useForgeStore } from "./forge";
import { useMetalmancerStore } from "./metalmancer";
import { useSmelterStore } from "./smelter";
import { useWarformerStore } from "./warformer";

export const useExpansionsStore = defineStore("expansions", {
    state: () => {
        return {
            built: {
                1: [],
                2: [],
                3: []
            },
            all: {
                //mines
                mines: {
                    id: "mines", 
                    name: "Mines", 
                    tier: 1, 
                    piniaObject() {
                        const mines = useMinesStore();
                        return mines;
                    },
                    costs: {
                        gold: 30
                    }
                },
                metalmancer: {
                    id: "metalmancer",
                    name: "Metalmancer",
                    tier: 2,
                    piniaObject() {
                        const metalmancer = useMetalmancerStore();
                        return metalmancer;
                    },
                    costs: {
                        stone: 500,
                        gold: 2000
                    },
                    hasSummon: true
                },
                forge: {
                    id: "forge",
                    name: "Forge",
                    tier: 2,
                    piniaObject() {
                        const forge = useForgeStore();
                        return forge;
                    },
                    costs: {
                        stone: 500,
                        gold: 2000
                    }
                },
                smelter: {
                    id: "smelter",
                    name: "Smelter",
                    tier: 3,
                    piniaObject() {
                        const smelter = useSmelterStore();
                        return smelter;
                    },
                    costs: {
                        stone: 500,
                        gold: 2000
                    }
                },
                warformer: {
                    id: "warformer",
                    name: "Warformer",
                    tier: 3,
                    piniaObject() {
                        const warformer = useWarformerStore();
                        return warformer;
                    },
                    costs: {
                        stone: 500,
                        gold: 2000
                    },
                    hasSummon: true
                }
            },
            slots: {
                1: 1,
                2: 1,
                3: 1
            }
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
        hasExpansion(state){
            return (expansionId) => {
                for (var i in state.built) {
                    if (state.built[i].includes(expansionId)) {
                        return true;
                    }
                }
                return false;
            }
        },
        hasTier(state) {
            return (tier) => {
                return state.built[tier].length > 0 ? true : false;
            }
        },
        getObjectById(state) {
            return (expansionId) =>  {
                return state.all[expansionId];
            }
        },
        getCostObject(state) {
            return (expansionId) => {
                return state.all[expansionId].costs;
            }
        },
        checkIfSummonAvailable(state) {
            for (var i in state.built) {
                for (var j in state.built[i]) {
                    if (state.all[state.built[i][j]].hasSummon) {
                        return true;
                    }
                }
            }
            return false;
        },
        //slots
        getNumOfSlots(state) {
            return (tier) => {
                return state.slots[tier];
            }
        },
        hasExpansionSpace(state) {
            return (tier) => {
                return state.built[tier].length < state.slots[tier];
            }
        }
    },
    actions: {
        buildExpansion(expansionId) {
            const resources = useResourcesStore();

            const chosenExpansion = this.getObjectById(expansionId);
            const chosenTier = chosenExpansion.tier;
            this.built[chosenTier].push(chosenExpansion.id);

            const costs = chosenExpansion.costs;

            resources.removeResources(costs);

            const pinia = chosenExpansion.piniaObject();
            pinia.onBuild();

        },
        expansionTicks() {
            for (var i in this.getBuilt) {
                for (var j in this.getBuilt[i]) {
                    const pinia = this.getObjectById(this.getBuilt[i][j]).piniaObject();
                    pinia.tick();
                }
            }
        }
    }
})