import { useResourcesStore } from "./stores/resources.js";
import { useExpansionsStore } from "./stores/expansions.js";
import { useMiscStore } from "./stores/misc.js";
import { useTextLogStore } from "./stores/textLog.js";

import { addCultist, buildExpansion, buildBuilding } from "./functions.js";
import { useBuildingsStore } from "./stores/buildings.js";

export const actions = {
    //actions are stored as objects that then get rendered to the dom
    centralChamber: {
        name: "Central Chamber",
        desc: "The Centeral Chamber, in the Heart of your EVIL Lair! >:)",
        tier: "tier0",
        showCondition() {return true},
        buttons : {
            acquireGold: {
                id: "acquireGold",
                name: "Acquire Gold",
                effect(){
                    const resources = useResourcesStore();
                    resources.modifyResource("Gold", 1);
                },
                condition(){return true},
                showCondition() {return true}
            },
            beEvil: {
                id: "beEvil",
                name: "Be Evil >:)",
                effect(){
                    const resources = useResourcesStore();
                    resources.modifyResource("Evilness", 1);
                },
                condition(){return true},
                showCondition(){return true}
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
                    return expansions.hasTier1 == false;
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
                    return expansions.hasTier1 == false;
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
                }
            },
            //TEST BUTTON - REMOVE FOR RELEASE
            testButton: {
                id: "testButton",
                name: "Test button",
                effect() {
                    const textLog = useTextLogStore();
                    textLog.playConvo(1);
                },
                condition() {
                    return true
                },
                showCondition() {
                    return true
                }  
            },
            testButton2: {
                id: "testButton2",
                name: "Test button 2",
                effect() {
                    const textLog = useTextLogStore();
                    textLog.playConvo(2);
                },
                condition() {
                    return true
                },
                showCondition() {
                    return true
                }  
            }
        }
    },
    humanResources: {
        name: "Human Resources",
        desc: "The HR department of your EVIL cult >:)",
        tier: "tier0",
        showCondition() {return true},
        buttons: {
            hireHumanCultist: {
                id: "hireHumanCultist",
                name: "Hire Human Cultist",
                effect() {
                    addCultist("Human");
                },
                condition() {
                    const resources = useResourcesStore();
                    const misc = useMiscStore();
                    return resources.getResourceTotal("Gold") >= 20 && misc.checkCultistSpace;
                },
                showCondition() {return true}
            },
            hireDwarfCultist: {
                id: "hireDwarfCultist",
                name: "Hire Dwarf Cultist",
                effect() {
                    addCultist("Dwarf");
                },
                condition() {
                    const resources = useResourcesStore();
                    const misc = useMiscStore();
                    return resources.getResourceTotal("Gold") >= 2000 && misc.checkCultistSpace;
                },
                showCondition() {return true}
            },
            hireSlimeCultist: {
                id: "hireSlimeCultist",
                name: "Hire Slime Cultist",
                effect() {
                    addCultist("Slime");
                },
                condition() {
                    const resources = useResourcesStore();
                    const misc = useMiscStore();
                    return resources.getResourceTotal("Gold") >= 2500 && resources.getResourceTotal("Crystals") >= 1000 && misc.checkCultistSpace;
                },
                showCondition() {return true}
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
                showCondition() {return true}
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
                showCondition() {return true}
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
                showCondition() {return true}
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
                showCondition() {return true}
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
                showCondition() {return true}
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
                showCondition() {return true}
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
                showCondition() {return true}
            }
        }
    }
}