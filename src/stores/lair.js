import { defineStore } from "pinia";

import { useExpansionsStore } from "./globalPinias/expansions";
import { useResourcesStore } from "./globalPinias/resources";
import { useBuildingsStore } from "./globalPinias/buildings";

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
                        }
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
                        expansionMines: {
                            id: "expansionMines",
                            name: "T1 Expansion: Mines",
                            desc: "Start digging a mineshaft underneath your evil lair!",
                            costs() {
                                const expansions = useExpansionsStore();
                                return expansions.getCostObject("mines");
                            },
                            condition() {
                                const expansions = useExpansionsStore();
                                const resources = useResourcesStore();
                                return resources.checkIfCanAfford(expansions.getCostObject("mines"));
                            },
                            showCondition() {
                                const expansions = useExpansionsStore();
                                return expansions.hasExpansionSpace(1);
                            },
                            effect() {
                                const expansions = useExpansionsStore();
                                expansions.buildExpansion("mines");
                            }
                        },
                        expansionBarracks: {
                            id: "expansionBarracks",
                            name: "T1 Expansion: Barracks",
                            desc: "Start sending your cultists on expeditions to find loot and be evil!!",
                            costs() {
                                const expansions = useExpansionsStore();
                                return expansions.getCostObject("barracks");
                            },
                            condition() {
                                const expansions = useExpansionsStore();
                                const resources = useResourcesStore();
                                return resources.checkIfCanAfford(expansions.getCostObject("barracks"));
                            },
                            showCondition() {
                                //COME BACK AND CHANGE THIS WHEN MORE EXPANSION SLOTS ADDED
                                const expansions = useExpansionsStore();
                                //return expansions.hasExpansionSpace(1);
                                return !expansions.hasExpansion("barracks");
                            },
                            effect() {
                                const expansions = useExpansionsStore();
                                expansions.buildExpansion("barracks");
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
                        return resources.getEvilness >= buildingObj.reqs.evilness && expansions.hasTier(buildingObj.reqs.expansionTier) && (buildings.checkBuildingReqs(buildingObj.reqs.buildings) || !buildingObj.reqs.buildings);
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