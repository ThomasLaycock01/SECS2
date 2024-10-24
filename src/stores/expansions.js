import { defineStore } from "pinia";

import { useResourcesStore } from "./globalPinias/resources";
import { useMinesStore } from "./mines"; 
import { useForgeStore } from "./forge";
import { useMetalmancerStore } from "./metalmancer";

export const useExpansionsStore = defineStore("expansions", {
    state: () => {
        return {built: {
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
            }
            /*
            {id: "laboratory", name: "Laboratory", tier: "tier1"},
            {id: "barracks", name: "Barracks", tier: "tier2"},
            {id: "tower", name: "Tower", tier: "tier2"},
            {id: "academy", name: "Academy", tier: "tier3"},
            {id: "dungeons", name: "Dungeons", tier: "tier3"}*/
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
        /*
        checkIfBuilt(state) {
            return (expansionId) => {
                const expansionObject = this.getObjectById(expansionId);
                if (state.built[expansionObject.tier] == expansionId) {
                    return true;
                }
                return false;
            };
        },*/
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