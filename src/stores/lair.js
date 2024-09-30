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
                    desc: "Be Evil - and Gain 1 Evilness",
                    condition() {
                        return true;
                    },
                    showCondition() {
                        return true;
                    },
                    effect() {
                        const resources = useResourcesStore();
                        resources.modifyResource("evilness", 1)
                    }
                },
                acquireGold: {
                    id: "acquireGold",
                    name: "Acquire Gold",
                    desc: "Acquire 1 Gold?",
                    condition() {
                        return true;
                    },
                    showCondition() {
                        return true;
                    },
                    effect() {
                        const resources = useResourcesStore();
                        resources.modifyResource("gold", 1)
                    }
                },
                //expansions
                expansionMines: {
                    id: "expansionMines",
                    name: "Expansion: Mines",
                    desc: "Build a mineshaft for your EVIL mining operations.",
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