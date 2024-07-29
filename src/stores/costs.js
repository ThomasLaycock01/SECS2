import { defineStore } from "pinia";

import { useResourcesStore } from "./resources";
import { useBuildingsStore } from "./buildings";

export const useCostsStore = defineStore("costs", {
    state: () => {
        return {
            cultists: {
                human: {gold: 20},
                dwarf: {gold: 2000},
                slime: {gold: 2500, crystals: 1000}
            },
            buildings: {
                //mines
                goldMine: {
                    costs: {gold: 20},
                    exponents: {gold: 1.5}
                },
                crystalMine: {
                    costs: {gold: 50},
                    exponents: {gold: 1.5}
                },
                //laboratory
                transmuter: {
                    costs: {gold: 25},
                    exponents: {gold: 1.5}
                },
                crystalliser: {
                    costs: {gold: 30},
                    exponents: {gold: 1.5}
                },
                //barracks
                drillSquare: {
                    costs: {gold: 500, crystals: 250},
                    exponents: {gold: 2, crystals: 2}
                },
                bunkBeds: {
                    costs: {gold: 1000, crystals: 700},
                    exponents: {gold: 3, crystals: 2.5}
                },
                //tower
                infuser: {
                    costs: {gold: 500, crystals: 500},
                    exponents: {gold: 2, crystals: 2}
                },
                //academy
                lectureHall: {
                    costs: {gold: 2500, crystals: 1000},
                    exponents: {gold: 5, crystals: 4}
                },
                library: {
                    costs: {gold: 5000, crystals: 2000},
                    exponents: {gold: 4, crystals: 4}
                },
                //dungeons
                cell: {
                    costs: {gold: 2000, crystals: 1500},
                    exponents: {gold: 4, crystals: 3}
                },
                tortureChamber: {
                    costs: {gold: 2000, crystals: 1500},
                    exponents: {gold: 4, crystals: 3}
                }
            },
            expansions: {
                //t1
                tier1: {gold: 30},
                tier2: {gold: 3000, crystals: 2500},
                tier3: {gold: 20000, crystals: 15000}
            }
        }
    },
    getters: {
        getCultistCost(state) {
            return (type) => state["cultists"][type];
        },
        getExpansionTierCost(state) {
            return (expansionTier) => state["expansions"][expansionTier];
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
                toReturn[i] = Math.floor(toBuild["costs"][i] * (toBuild["exponents"][i] ** buildings.getNumOfBuildingById(type)));
            }

            

            return toReturn;
        },
        saveData() {
            var data = JSON.parse(localStorage.getItem("SECSData"));

            const costsObject = {};

            for (var i in this["buildings"]) {
                costsObject[i] = this["buildings"][i].costs;
            }

            data.costs = costsObject;

            localStorage.setItem("SECSData", JSON.stringify(data));
        },
        loadData() {
            var data = JSON.parse(localStorage.getItem("SECSData"));

            for (var i in data.costs) {
                this["buildings"][i]["costs"] = data.costs[i];
            }
        }
    }
})