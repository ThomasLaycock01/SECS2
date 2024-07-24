import { useResourcesStore } from "./stores/resources.js";
import { useExpansionsStore } from "./stores/expansions.js";
import { useMiscStore } from "./stores/misc.js";
import { useCostsStore } from "./stores/costs.js";

import { addCultist, buildExpansion, buildBuilding, checkCultistSpace } from "./functions.js";
import { useBuildingsStore } from "./stores/buildings.js";

export const actions = {
    //actions are stored as objects that then get rendered to the dom
    centralChamber: {
        name: "Central Chamber",
        desc: "The Centeral Chamber, in the Heart of your EVIL Lair! >:)",
        tier: "tier0",
        showCondition() {return true},
        buttons : {
            beEvil: {
                id: "beEvil",
                name: "Be Evil >:)",
                effect(){
                    const resources = useResourcesStore();
                    resources.modifyResource("Evilness", 1);
                },
                condition(){return true},
                showCondition(){return true},
                tooltipData: {
                    title: "Be Evil >:)",
                    body: "Gain 1 Evilness",
                    flavour: "MWUH HA HA HA HA!!!!"
                }
            },
            acquireGold: {
                id: "acquireGold",
                name: "Acquire Gold",
                effect(){
                    const resources = useResourcesStore();
                    resources.modifyResource("Gold", 1);
                },
                condition(){return true},
                showCondition() {
                    const misc = useMiscStore();
                    return misc.checkHasSeenConvo(2);
                },
                tooltipData: {
                    title: "Acquire Gold",
                    body: "Gain 1 Gold",
                    flavour: "Who knows where it comes from?"
                }
            },
            expansionMines: {
                id: "expansionMines",
                name: "Expansion: Mines",
                effect() {
                    buildExpansion("mines");
                },
                condition(){
                    const expansions = useExpansionsStore();
                    return expansions.checkIfCanAfford("mines");
                },
                showCondition() {
                    const expansions = useExpansionsStore();
                    const misc = useMiscStore();
                    return misc.checkHasSeenConvo(3) && expansions.hasTier1 == false;
                },
                tooltipData: {
                    title: "Expansion: Mines",
                    body: "A mineshaft under your lair",
                    costs() {
                        const costs = useCostsStore();
                        return costs.getExpansionCost("mines");
                    }
                }
            },
            expansionLaboratory: {
                id: "expansionLaboratory",
                name: "Expansion: Laboratory",
                effect(){
                    buildExpansion("laboratory");
                },
                condition(){
                    const expansions = useExpansionsStore();
                    return expansions.checkIfCanAfford("laboratory");
                },
                showCondition() {
                    const expansions = useExpansionsStore();
                    const misc = useMiscStore();
                    return misc.checkHasSeenConvo(3) && expansions.hasTier1 == false;
                },
                tooltipData: {
                    title: "Expansion: Laboratory",
                    body: "A laboratory for evil experiments",
                    costs() {
                        const costs = useCostsStore();
                        return costs.getExpansionCost("laboratory");
                    }
                }
            },
            expansionBarracks: {
                id: "expansionBarracks",
                name: "Expansion: Barracks",
                effect() {
                    buildExpansion("barracks");
                },
                condition() {
                    const expansions = useExpansionsStore();
                    return expansions.checkIfCanAfford("barracks");
                },
                showCondition() {
                    const expansions = useExpansionsStore();
                    return (expansions.hasTier2 == false && expansions.hasTier1)
                },
                tooltipData: {
                    title: "Expansion: Barracks",
                    body: "An area to organize your cultist army",
                    costs() {
                        const costs = useCostsStore();
                        return costs.getExpansionCost("barracks");
                    }
                }
            },
            expansionTower: {
                id: "expansionTower",
                name: "Expansion: Tower",
                effect() {
                    buildExpansion("tower");
                },
                condition() {
                    const expansions = useExpansionsStore();
                    return expansions.checkIfCanAfford("tower");
                },
                showCondition() {
                    const expansions = useExpansionsStore();
                    return (expansions.hasTier2 == false && expansions.hasTier1)
                },
                tooltipData: {
                    title: "Expansion: Tower",
                    body: "A tower to cast spells from",
                    costs() {
                        const costs = useCostsStore();
                        return costs.getExpansionCost("tower");
                    }
                }
            },
            expansionAcademy: {
                id: "expansionAcademy",
                name: "Expansion: Academy",
                effect() {
                    buildExpansion("academy");
                },
                condition() {
                    const expansions = useExpansionsStore();
                    return expansions.checkIfCanAfford("academy");
                },
                showCondition() {
                    const expansions = useExpansionsStore();
                    return (expansions.hasTier3 == false && expansions.hasTier2)
                },
                tooltipData: {
                    title: "Expansion: Academy",
                    body: "An academy to educate future generations of cultists",
                    costs() {
                        const costs = useCostsStore();
                        return costs.getExpansionCost("academy");
                    }
                }
            },
            expansionDungeons: {
                id: "expansionDungeons",
                name: "Expansion: Dungeons",
                effect() {
                    buildExpansion("dungeons");
                },
                condition() {
                    const expansions = useExpansionsStore();
                    return expansions.checkIfCanAfford("dungeons");
                },
                showCondition() {
                    const expansions = useExpansionsStore();
                    return (expansions.hasTier3 == false && expansions.hasTier2)
                },
                tooltipData: {
                    title: "Expansion: Dungeons",
                    body: "Dungeons for misbehaving cultists",
                    costs() {
                        const expansions = useExpansionsStore();
                        return expansions.getExpansionCosts("dungeons");
                    }
                }
            }
        }
    },
    humanResources: {
        name: "Human Resources",
        desc: "The HR department of your EVIL cult >:)",
        tier: "tier0",
        showCondition() {
            const misc = useMiscStore();
            return misc.checkHasSeenConvo(2);
        },
        buttons: {
            hireHumanCultist: {
                id: "hireHumanCultist",
                name: "Hire Human Cultist",
                effect() {
                    addCultist("Human");
                },
                condition() {
                    const misc = useMiscStore();
                    const costs = useCostsStore();

                    return costs.checkIfCanAffordCultist("human") && checkCultistSpace();
                },
                showCondition() {return true},
                tooltipData: {
                    title: "Hire Human Cultist",
                    body: "Hire a human cultist",
                    costs() {
                        const costs = useCostsStore();
                        return costs.getCultistCost("human");
                    }
                }
            },
            hireDwarfCultist: {
                id: "hireDwarfCultist",
                name: "Hire Dwarf Cultist",
                effect() {
                    addCultist("Dwarf");
                },
                condition() {
                    const misc = useMiscStore();
                    const costs = useCostsStore();

                    return costs.checkIfCanAffordCultist("dwarf") && checkCultistSpace();
                },
                showCondition() {
                    const misc = useMiscStore();
                    return misc.checkHasSeenConvo(4);
                },
                tooltipData: {
                    title: "Hire Dwarf Cultist",
                    body: "Hire a dwarf cultist",
                    costs() {
                        const costs = useCostsStore();
                        return costs.getCultistCost("dwarf");
                    }
                }
            },
            hireSlimeCultist: {
                id: "hireSlimeCultist",
                name: "Hire Slime Cultist",
                effect() {
                    addCultist("Slime");
                },
                condition() {
                    const misc = useMiscStore();
                    const costs = useCostsStore();

                    return costs.checkIfCanAffordCultist("slime") && checkCultistSpace();
                },
                showCondition() {
                    const misc = useMiscStore();
                    return misc.checkHasSeenConvo(4);
                },
                tooltipData: {
                    title: "Hire Slime Cultist",
                    body: "Hire a slime cultist",
                    costs() {
                        const costs = useCostsStore();
                        return costs.getCultistCost("slime");
                    }
                }
            }
        }
    },
    mines: {
        id: "mines",
        name: "Mines",
        desc: "A mineshaft underneath your EVIL lair >:)",
        tier: "tier1",
        showCondition() {
            const expansions = useExpansionsStore();
            return expansions.checkIfBuilt(this.id, this.tier);
        },
        buttons: {
            goldMine: {
                id: "goldMine",
                name: "Gold Mine",
                effect() {
                    buildBuilding("goldMine")
                },
                condition() {
                    const buildings = useBuildingsStore();
                    return buildings.checkIfCanAfford("goldMine");
                },
                showCondition() {return true},
                tooltipData: {
                    title: "Gold Mine",
                    body: "A mine to acquire gold",
                    costs() {
                        const costs = useCostsStore();
                        return costs.getTotalBuildingCost("goldMine");
                    }
                }
                
            },
            crystalMine: {
                id: "crystalMine",
                name: "Crystal Mine",
                effect() {
                    buildBuilding("crystalMine");
                },
                condition() {
                    const buildings = useBuildingsStore();
                    return buildings.checkIfCanAfford("crystalMine");
                },
                showCondition() {return true},
                tooltipData: {
                    title: "Crystal Mine",
                    body: "A mine to acquire crystals",
                    costs() {
                        const costs = useCostsStore();
                        return costs.getTotalBuildingCost("crystalMine");
                    }
                }
            }
        }
    },
    laboratory: {
        id: "laboratory",
        name: "Laboratory",
        desc: "A laboratory for your EVIL experiments >:)",
        tier: "tier1",
        showCondition() {
            const expansions = useExpansionsStore();
            return expansions.checkIfBuilt(this.id, this.tier);
        },
        buttons: {
            transmuter: {
                id: "transmuter",
                name: "Transmuter",
                effect() {
                    buildBuilding("transmuter");
                },
                condition() {
                    const buildings = useBuildingsStore();
                    return buildings.checkIfCanAfford("transmuter");
                },
                showCondition() {return true},
                tooltipData: {
                    title: "Transmuter",
                    body: "A device for turning lead into gold",
                    costs() {
                        const costs = useCostsStore();
                        return costs.getTotalBuildingCost("transmuter");
                    }
                }
            },
            crystallizer: {
                id: "crystalliser",
                name: "Crystalliser",
                effect() {
                    buildBuilding("crystalliser");
                },
                condition() {
                    const buildings = useBuildingsStore();
                    return buildings.checkIfCanAfford("crystalliser");
                },
                showCondition() {return true},
                tooltipData: {
                    title: "Crystalliser",
                    body: "A device for not-crystals into crystals",
                    costs() {
                        const costs = useCostsStore();
                        return costs.getTotalBuildingCost("crystalliser");
                    }
                }
            }
        }
    },
    barracks: {
        id: "barracks",
        name: "Barracks",
        desc: "A place to organize your EVIL army >:)",
        tier: "tier2",
        showCondition() {
            const expansions = useExpansionsStore();
            return expansions.checkIfBuilt(this.id, this.tier);
        },
        buttons: {
            drillSquare: {
                id: "drillSquare",
                name: "Drill Square",
                effect() {
                    buildBuilding("drillSquare");
                },
                condition() {
                    const buildings = useBuildingsStore();
                    return buildings.checkIfCanAfford("drillSquare");
                },
                showCondition() {return true},
                tooltipData: {
                    title: "Drill Square",
                    body: "A square for preparing your soldiers",
                    costs() {
                        const buildings = useBuildingsStore();
                        return buildings.getBuildingCostsById("drillSquare")
                    }
                }
            }
        }
    },
    tower: {
        id: "tower",
        name: "Tower",
        desc: "A place to cast your EVIL spells >:)",
        tier: "tier2",
        showCondition() {
            const expansions = useExpansionsStore();
            return expansions.checkIfBuilt(this.id, this.tier);
        },
        buttons: {
            infuser: {
                id: "infuser",
                name: "Infuser",
                effect() {
                    buildBuilding("infuser");
                },
                condition() {
                    const buildings = useBuildingsStore();
                    return buildings.checkIfCanAfford("infuser");
                },
                showCondition() {return true},
                tooltipData: {
                    title: "Infuser",
                    body: "A device for infusing crystals with mana",
                    costs() {
                        const buildings = useBuildingsStore();
                        return buildings.getBuildingCostsById("infuser")
                    }
                }
            }
        }
    },
    academy: {
        id: "academy",
        name: "Academy",
        desc: "A place to teach your EVIL lessons >:)",
        tier: "tier3",
        showCondition() {
            const expansions = useExpansionsStore();
            return expansions.checkIfBuilt(this.id, this.tier);
        },
        buttons: {
            lectureHall: {
                id: "lectureHall",
                name: "Lecture Hall",
                effect() {
                    buildBuilding("lectureHall");
                },
                condition() {
                    const buildings = useBuildingsStore();
                    return buildings.checkIfCanAfford("lectureHall");
                },
                showCondition() {return true},
                tooltipData: {
                    title: "Lecture Hall",
                    body: "A place for turning your cultists into smarter cultists",
                    costs() {
                        const buildings = useBuildingsStore();
                        return buildings.getBuildingCostsById("lectureHall")
                    }
                }
            }
        }
    },
    dungeons: {
        id: "dungeons",
        name: "Dungeons",
        desc: "A place to keep your EVIL prisons >:)... no, wait - a place to keep your GOOD prisoners :)",
        tier: "tier3",
        showCondition() {
            const expansions = useExpansionsStore();
            return expansions.checkIfBuilt(this.id, this.tier);
        },
        buttons: {
            cell: {
                id: "cell",
                name: "Cell",
                effect() {
                    buildBuilding("cell");
                },
                condition() {
                    const buildings = useBuildingsStore();
                    return buildings.checkIfCanAfford("cell");
                },
                showCondition() {return true},
                tooltipData: {
                    title: "Cell",
                    body: "I guess you can sleep here, or something",
                    costs() {
                        const buildings = useBuildingsStore();
                        return buildings.getBuildingCostsById("cell")
                    }
                }
            }
        }
    }
}