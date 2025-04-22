import { defineStore } from "pinia";

import { useExpansionsStore } from "./globalPinias/expansions";
import { useResourcesStore } from "./globalPinias/resources";
import { useBuildingsStore } from "./globalPinias/buildings";
import { useProgressionStore } from "./misc/progression";

//teting only
import { useInventoryStore } from "./globalPinias/inventory";

export const useLairStore = defineStore("lair", {
    state: () => {
        return {
            actions: {
                actions: {
                    id: "actions",
                    name: "Actions",
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
                                const progression = useProgressionStore();
                                return progression.checkUnlocked("10Evilness");
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
                        debugGrain: {
                            id: "debugGrain",
                            name: "Debug Grain",
                            desc: "Add a bajillion grain",
                            condition() {
                                return true;
                            },
                            showCondition() {
                                return true;
                            },
                            effect() {
                                const resources = useResourcesStore();
                                resources.modifyResource("grain", 1000000)
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
                                inventory.addItem(1000);
                            }
                        }
                    }
                },
                buildings: {
                    id: "buildings",
                    name: "Buildings",
                    buttons: {
                        buildChambers: {
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
                                const progression = useProgressionStore();
                                return progression.checkUnlocked("firstParty");
                            },
                            effect() {
                                const buildings = useBuildingsStore();
                                buildings.build("chambers");
                            }
                        },
                        buildEvilShrine: {
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
                                const progression = useProgressionStore();
                                return progression.checkUnlocked("firstParty");
                            },
                            effect() {
                                const buildings = useBuildingsStore();
                                buildings.build("evilShrine");
                            }
                        },
                        buildFightersGuild: {
                            id: "buildFightersGuild",
                            name: "Fighter's Guild",
                            desc: "Establish a branch of the Fighter's Guild in your Lair - they'll help train cultists!",
                            effectDesc: "Unlock Role - Fighter",
                            owned() {
                                const buildings = useBuildingsStore();
                                return buildings.getOwned("fightersGuild");
                            },
                            limit() {
                                const buildings = useBuildingsStore();
                                return buildings.getLimit("fightersGuild");
                            },
                            costs() {
                                const buildings = useBuildingsStore();
                                return buildings.getCosts("fightersGuild");
                            },
                            condition() {
                                const resources = useResourcesStore();
                                const buildings = useBuildingsStore();
                                return resources.checkIfCanAfford(this.costs()) && !buildings.checkIfAtLimit("fightersGuild");
                            },
                            showCondition() {
                                const progression = useProgressionStore();
                                return progression.checkUnlocked("1000Evilness");
                            },
                            effect() {
                                const buildings = useBuildingsStore();
                                buildings.build("fightersGuild");
                            }
                        },
                        buildKnightOutreach: {
                            id: "buildKnightOutreach",
                            name: "Knight Outreach",
                            desc: "Lobby the Order of Knights to take on some Squires.",
                            effectDesc: "Unlock Role - Squire",
                            owned() {
                                const buildings = useBuildingsStore();
                                return buildings.getOwned("knightOutreach");
                            },
                            limit() {
                                const buildings = useBuildingsStore();
                                return buildings.getLimit("knightOutreach");
                            },
                            costs() {
                                const buildings = useBuildingsStore();
                                return buildings.getCosts("knightOutreach");
                            },
                            condition() {
                                const resources = useResourcesStore();
                                const buildings = useBuildingsStore();
                                return resources.checkIfCanAfford(this.costs()) && !buildings.checkIfAtLimit("knightOutreach");
                            },
                            showCondition() {
                                const progression = useProgressionStore();
                                return progression.checkUnlocked("1000Evilness");
                            },
                            effect() {
                                const buildings = useBuildingsStore();
                                buildings.build("knightOutreach");
                            }
                        },
                        buildApprenticeshipProgram: {
                            id: "buildApprenticeshipProgram",
                            name: "Apprenticeship program",
                            desc: "Sign some cultists up for an apprenticeship at the Mages Guild - you'll need to pay their scholarship fees.",
                            effectDesc: "Unlock Role - Apprentice",
                            owned() {
                                const buildings = useBuildingsStore();
                                return buildings.getOwned("apprenticeshipProgram");
                            },
                            limit() {
                                const buildings = useBuildingsStore();
                                return buildings.getLimit("apprenticeshipProgram");
                            },
                            costs() {
                                const buildings = useBuildingsStore();
                                return buildings.getCosts("apprenticeshipProgram");
                            },
                            condition() {
                                const resources = useResourcesStore();
                                const buildings = useBuildingsStore();
                                return resources.checkIfCanAfford(this.costs()) && !buildings.checkIfAtLimit("apprenticeshipProgram");
                            },
                            showCondition() {
                                const progression = useProgressionStore();
                                return progression.checkUnlocked("1000Evilness");
                            },
                            effect() {
                                const buildings = useBuildingsStore();
                                buildings.build("apprenticeshipProgram");
                            }
                        },
                        buildCartographerPlains: {
                            id: "buildCartographerPlains",
                            name: "Cartographer - Plains",
                            desc: "Hire some cartographers to make a proper map of the Plains - so you actually know where you're going.",
                            effectDesc: "Increase Plains hardcap to Level 20",
                            owned() {
                                const buildings = useBuildingsStore();
                                return buildings.getOwned("cartographerPlains");
                            },
                            limit() {
                                const buildings = useBuildingsStore();
                                return buildings.getLimit("cartographerPlains");
                            },
                            costs() {
                                const buildings = useBuildingsStore();
                                return buildings.getCosts("cartographerPlains");
                            },
                            condition() {
                                const resources = useResourcesStore();
                                const buildings = useBuildingsStore();
                                return resources.checkIfCanAfford(this.costs()) && !buildings.checkIfAtLimit("cartographerPlains");
                            },
                            showCondition() {
                                const progression = useProgressionStore();
                                return progression.checkUnlocked("1000Evilness");
                            },
                            effect() {
                                const buildings = useBuildingsStore();
                                buildings.build("cartographerPlains");
                            }
                        }
                    }
                },
                expansions: {
                    id: "expansions",
                    name: "Expansions",
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
                                return progression.checkUnlocked("completedAbandonedFarmhouse") && !expansions.checkIfBuilt("farm");
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