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
                                const expansions = useExpansionsStore();
                                const resources = useResourcesStore();
                                return resources.checkIfCanAfford(expansions.getCosts("farm"));
                            },
                            showCondition() {
                                const progression = useProgressionStore();
                                const expansions = useExpansionsStore();
                                return progression.checkUnlocked("completedExpedition") && !expansions.checkIfBuilt("farm");
                            },
                            effect() {
                                const expansions = useExpansionsStore();
                                expansions.buildExpansion("farm");
                            }
                        }
                    }
                }
            },
            buildings: {

            }
        }
    },
    getters: {
        //actions
        getActions(state) {
            return state.actions;
        },
        //buildings
        getNumOfBuilding(state) {
            return (buildingId) => state.buildings[buildingId].owned;
        }
    },
    actions: {
        //buildings
        buildBuilding(buildingId) {
            this.buildings[buildingId].owned += 1;

            return this.buildings[buildingId].costs;
        },
        updateBuildingCost(buildingId) {
            for (var i in this.buildings[buildingId].costs) {
                this.buildings[buildingId].costs[i] = Math.round(this.buildings[buildingId].costs[i] * this.buildings[buildingId].exponents[i]);
            }
        },
        instantiateBuildings() {
            const id = this.$id;

            this.buildings = buildings["lair"];
            for (var i in this.buildings) {
                this.buildings[i]["owned"] = 0;
            }

            for (var i in this.buildings) {
                const buildingObj = this.buildings[i];

                this.actions.buildings.buttons[i] = {
                    id: buildingObj["id"],
                    name: buildingObj["name"],
                    desc: buildingObj["desc"],
                    effectDesc: buildingObj["effectDesc"],
                    limit: buildingObj["limit"],
                    owned() {
                        const buildings = useBuildingsStore();
                        return buildings.getNumOfBuildings(buildingObj.id);
                    },
                    costs() {
                        return buildingObj["costs"];
                    },
                    condition() {
                        const resources = useResourcesStore();
                        const buildings = useBuildingsStore();
                        return resources.checkIfCanAfford(buildingObj.costs) && this.owned() < buildingObj.limit;
                    },
                    showCondition() {
                        const resources = useResourcesStore();
                        const expansions = useExpansionsStore();
                        const buildings = useBuildingsStore();
                        return resources.getEvilness >= buildingObj.reqs.evilness && (buildings.checkBuildingReqs(buildingObj.reqs.buildings) || !buildingObj.reqs.buildings);
                    },
                    effect() {
                        const buildings = useBuildingsStore();
                        buildings.buildBuildings(id, buildingObj.id);
                    }
                }
            }
        }
    }
})