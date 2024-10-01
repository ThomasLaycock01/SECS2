import { defineStore } from "pinia";

import { useResourcesStore } from "./resources";

import { addCultist, posToNeg } from "@/functions";

export const useHRStore = defineStore("HR", {
    state: () => {
        return {
            actions: {
                hireHuman: {
                    id: "hireHuman",
                    name: "Hire Human Cultist",
                    desc: "Hire a Human Cultist",
                    costs() {
                        const HR = useHRStore();
                        return HR.getCultistCostBySpecies("human");
                    },
                    condition() {
                        const resources = useResourcesStore();
                        const HR = useHRStore();
                        return resources.checkIfCanAfford(HR.getCultistCostBySpecies("human"));
                    },
                    showCondition() {
                        return true;
                    },
                    effect() {
                        const HR = useHRStore();
                        HR.hireCultist("human");
                    },
                    tooltipData: {
                        name: "Hire Human",
                        desc: "Hire a human cultist",
                        costs: {gold: 20}
                    }
                }
            },
            misc: {
                cultistLimit: 2,
                costs: {
                    human: {gold: 20}
                }
            }
        }
    },
    getters: {
        //actions
        getActions(state) {
            return state.actions;
        },
        getCultistLimit(state) {
            return state.misc.cultistLimit;
        },
        //misc
        getCultistCostBySpecies(state) {
            return (species) => state.misc.costs[species];
        }
    },
    actions: {
        hireCultist(species) {
            const resources = useResourcesStore();
            
            resources.removeResources(this.getCultistCostBySpecies(species));

            addCultist(species);
            
        }
    }
})