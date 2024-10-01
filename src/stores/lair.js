import { defineStore } from "pinia";

import { useExpansionsStore } from "./expansions";
import { useResourcesStore } from "./resources";

export const useLairStore = defineStore("lair", {
    state: () => {
        return {
            actions: {
                beEvil: {
                    id: "beEvil",
                    name: "Be Evil >:)",
                    condition() {
                        return true;
                    },
                    showCondition() {
                        return true;
                    },
                    effect() {
                        const resources = useResourcesStore();
                        resources.modifyResource("evilness", 1)
                    },
                    tooltipData: {
                        name: "Be Evil >:)",
                        desc: "Be Evil - and Gain 1 Evilness"
                    }
                },
                acquireGold: {
                    id: "acquireGold",
                    name: "Acquire Gold",
                    condition() {
                        return true;
                    },
                    showCondition() {
                        return true;
                    },
                    effect() {
                        const resources = useResourcesStore();
                        resources.modifyResource("gold", 1)
                    },
                    tooltipData: {
                        name: "Acquire Gold",
                        desc: "Acquire 1 Gold"
                    }
                },
                //expansions
                expansionMines: {
                    id: "expansionMines",
                    name: "Expansion: Mines",
                    condition() {
                        const expansions = useExpansionsStore();
                        const resources = useResourcesStore();
                        return resources.checkIfCanAfford(expansions.getCostObject("mines"));
                    },
                    showCondition() {
                        const expansions = useExpansionsStore();
                        return expansions.hasTier1 ? false : true;
                    },
                    effect() {
                        const expansions = useExpansionsStore();
                        expansions.buildExpansion("mines");
                    },
                    tooltipData: {
                        name: "Expansion: Mines",
                        desc: "Start digging a mineshaft underneath your evil lair!"
                    }
                },
                //debug
                debugGold: {
                    id: "debugGold",
                    name: "Debug Gold",
                    desc: "Add a bajillion gold",
                    condition() {
                        return true;
                    },
                    showCondition() {
                        return true;
                    },
                    effect() {
                        const resources = useResourcesStore();
                        resources.modifyResource("gold", 1000000)
                    },
                    tooltipData: {
                        name: "Cheat",
                        desc: "give 1 million gold"
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