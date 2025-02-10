import { defineStore } from "pinia";

import { useResourcesStore } from "./resources";

import { useFarmStore } from "../expansions/farm";

export const useExpansionsStore = defineStore("expansions", {
    state: () => {
        return {
            expansions: {
                farm: {
                    id: "farm",
                    name: "Farm",
                    piniaObject() {
                        const farm = useFarmStore();
                        return farm;
                    },
                    costs: {
                        gold: 500
                    },
                    built: false
                }
            }
        }
    },
    getters: {
        checkIfBuilt(state) {
            return (expansionId) => {
                return state.expansions[expansionId].built;
            }
        },
        getCosts(state) {
            return (expansionId) => {
                return state.expansions[expansionId].costs;
            }
        }
    },
    actions: {
        buildExpansion(expansionId) {
            const resources = useResourcesStore();
            const chosenExpansion = this.expansions[expansionId];


            const costs = chosenExpansion.costs;
            resources.removeResources(costs);

            const pinia = chosenExpansion.piniaObject();
            pinia.onBuild();

            this.expansions[expansionId].built = true;
        },
        expansionTicks() {
            for (var i in this.expansions) {
                if (this.expansions[i].built) {
                    this.expansions[i].piniaObject().tick();
                }
            }
        }
    }
})