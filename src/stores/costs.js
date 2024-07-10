import { defineStore } from "pinia";

import { useResourcesStore } from "./resources";
import { useBuildingsStore } from "./buildings";

export const useCostsStore = defineStore("costs", {
    state: () => {
        return {
            cultists: {
                human: {Gold: 20},
                dwarf: {Gold: 2000},
                slime: {Gold: 2500, Crystals: 1000}
            },
            buildings: {
                goldMine: {
                    costs: {Gold: 20},
                    exponents: {Gold: 1.5}
                },
                crystalMine: {
                    costs: {Gold: 50},
                    exponents: {Gold: 1.5}
                }
            },
            expansions: {
                mines: {Gold: 30},
                laboratory: {Gold: 30}
            }
        }
    },
    getters: {
        getCultistCost(state) {
            return (type) => state["cultists"][type];
        }
    },
    actions: {
        checkIfCanAffordCultist(type) {
            const resources = useResourcesStore();

            var canAfford = true
            for (var i in this["cultists"][type]) {
                if (this["cultists"][type][i] > resources.getResourceTotal(i)) {
                    canAfford = false;
                }
            }

            return canAfford;
        },
        getTotalBuildingCost(type) {
            const buildings = useBuildingsStore();

            const toBuild = this["buildings"][type]
            const toReturn = {};

            for (var i in toBuild["costs"]) {
                toReturn[i] = toBuild["costs"][i] * (toBuild["exponents"][i] ** buildings.getNumOfBuildingById(type));
            }

            return toReturn;
        }
    }
})