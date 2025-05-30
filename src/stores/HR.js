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
                            name: "Recruit: Human",
                            tooltip: {
                                type: "reg",
                                name: "Recruit: Human",
                                desc: "Hire a Human Cultist",
                                raceId: "human"
                            },
                            
                            costs() {
                                const cultists = useCultistsStore();
                                return cultists.getRaceCosts("human");
                            },
                            condition() {
                                const resources = useResourcesStore();
                                const cultists = useCultistsStore();
                                return resources.checkIfCanAfford(cultists.getRaceCosts("human")) && cultists.checkCultistSpace;
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
            }
        }
    },
    getters: {
        //actions
        getActions(state) {
            return state.actions;
        }
    },
    actions: {
        hireCultist(species) {
            const resources = useResourcesStore();
            const cultists = useCultistsStore();
            
            console.log(cultists.getRaceCosts(species));

            resources.removeResources(cultists.getRaceCosts(species));

            addCultist(species);
            
        }
    }
})