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
                    costs:{gold: 20},
                    condition() {
                        const resources = useResourcesStore();
                        return resources.checkIfCanAfford(this.costs);
                    },
                    showCondition() {
                        return true;
                    },
                    effect() {
                        //create the cultist
                        addCultist("Human")
                        //remove cost
                        const resources = useResourcesStore();
                        for (var i in this.costs) {
                            resources.modifyResource(i, posToNeg(this.costs[i]))
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
    }
})