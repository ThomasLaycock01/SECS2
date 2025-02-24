import { defineStore } from "pinia";

import { useExpansionsStore } from "./globalPinias/expansions";
import { useResourcesStore } from "./globalPinias/resources";
import { useBuildingsStore } from "./globalPinias/buildings";
import { useProgressionStore } from "./misc/progression";

//teting only
import { useInventoryStore } from "./globalPinias/inventory";

import buildings from "../assets/json/buildings.json";

export const useLairStore = defineStore("lair", {
    state: () => {
        return {
            actions: {
                actions: {
                    id: "actions",
                    name: "Actions",
                    tooltipType: "action",
                    buttons : {
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
                            desc: "Acquire 1 Gold",
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
                        },
                        debugEvilness: {
                            id: "debugEvilness",
                            name: "Debug Evilness",
                            desc: "Add a bajillion evilness",
                            condition() {
                                return true;
                            },
                            showCondition() {
                                return true;
                            },
                            effect() {
                                const resources = useResourcesStore();
                                resources.modifyResource("evilness", 1000000)
                            }
                        },
                        debugItem: {
                            id: "debugItem",
                            name: "Debug Item",
                            desc: "Add an item",
                            condition() {
                                return true;
                            },
                            showCondition() {
                                return true;
                            },
                            effect() {
                                const inventory = useInventoryStore();
                                inventory.addItem({"itemId": "2000", "type": "tool", "name": "Rusty Hoe", "shortName": "R. Hoe", "modifiers": [{"type": "farmer", "modifier": 0.05}], "sellValue": 10, "tier": 1, "effectDesc": "+5% output on Mine Workers"})
                            }
                        },
                    }
                },
                buildings: {
                    id: "buildings",
                    name: "Buildings",
                    tooltipType: "building",
                    buttons: {
                        chambers: {
                            id: "buildChambers",
                            name: "Chambers",
                            desc: "Some chambers for your cultists to sleep in.",
                            effectDesc: "+1 cultist limit",
                            owned() {
                                const buildings = useBuildingsStore();
                                return buildings.getOwned("chambers");
                            },
                            limit() {
                                const buildings = useBuildingsStore();
                                return buildings.getLimit("chambers");
                            },
                            costs() {
                                const buildings = useBuildingsStore();
                                return buildings.getCosts("chambers");
                            },
                            condition() {
                                const resources = useResourcesStore();
                                const buildings = useBuildingsStore();
                                return resources.checkIfCanAfford(this.costs()) && !buildings.checkIfAtLimit("chambers");
                            },
                            showCondition() {
                                return true;
                            },
                            effect() {
                                const buildings = useBuildingsStore();
                                buildings.build("chambers");
                            }
                        },
                        evilShrine: {
                            id: "buildEvilShrine",
                            name: "Evil Shrine",
                            desc: "An EVIL shrine",
                            effectDesc: "+10% evilness output on all cultists",
                            owned() {
                                const buildings = useBuildingsStore();
                                return buildings.getOwned("evilShrine");
                            },
                            limit() {
                                const buildings = useBuildingsStore();
                                return buildings.getLimit("evilShrine");
                            },
                            costs() {
                                const buildings = useBuildingsStore();
                                return buildings.getCosts("evilShrine");
                            },
                            condition() {
                                const resources = useResourcesStore();
                                const buildings = useBuildingsStore();
                                return resources.checkIfCanAfford(this.costs()) && !buildings.checkIfAtLimit("evilShrine");
                            },
                            showCondition() {
                                return true;
                            },
                            effect() {
                                const buildings = useBuildingsStore();
                                buildings.build("evilShrine");
                            }
                        }
                    }
                },
                expansions: {
                    id: "expansions",
                    name: "Expansions",
                    tooltipType: "expansion",
                    buttons: {
                        expansionFarm: {
                            id: "expansionFarm",
                            name: "Expansion: Farm",
                            desc: "Repurpose this old farm and start growing food - no-one can become Super Evil on an empty stomach!",
                            costs() {
                                const expansions = useExpansionsStore();
                                return expansions.getCosts("farm");
                            },
                            condition() {
                                const resources = useResourcesStore();
                                return resources.checkIfCanAfford(this.costs());
                            },
                            showCondition() {
                                const progression = useProgressionStore();
                                const expansions = useExpansionsStore();
                                //return progression.checkUnlocked("completedExpedition") && !expansions.checkIfBuilt("farm");
                                return true; //always available for testing
                            },
                            effect() {
                                const expansions = useExpansionsStore();
                                expansions.buildExpansion("farm");
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

    }
})