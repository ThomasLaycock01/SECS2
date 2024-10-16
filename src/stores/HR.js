import { defineStore } from "pinia";

import { useResourcesStore } from "./globalPinias/resources";
import { useCultistsStore } from "./globalPinias/cultists";

import { addCultist } from "@/functions";

export const useHRStore = defineStore("HR", {
    state: () => {
        return {
            actions: {
                recruitment: {
                    id: "recruitment",
                    name: "Recruitment",
                    buttons : {
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
                                const cultists = useCultistsStore();
                                const HR = useHRStore();
                                return resources.checkIfCanAfford(HR.getCultistCostBySpecies("human")) && cultists.checkCultistSpace();
                            },
                            showCondition() {
                                return true;
                            },
                            effect() {
                                const HR = useHRStore();
                                HR.hireCultist("human");
                            }
                        }  
                    }
                }
            },
            misc: {
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