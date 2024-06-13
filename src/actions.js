import { useResourcesStore } from "./stores/resources.js";
import { useExpansionsStore } from "./stores/expansions.js";
import { useMiscStore } from "./stores/misc.js";

import { addCultist, buildExpansion, buildBuilding } from "./functions.js";
import { useBuildingsStore } from "./stores/buildings.js";

export const actions = {
    //actions are stored as objects that then get rendered to the dom
    centralChamber: {
        name: "Central Chamber",
        desc: "The Centeral Chamber, in the Heart of your EVIL Lair!",
        tier: "tier0", //stored as a string to make interacting with the expansion store easier
        showCondition() {return true},
        buttons : {
            acquireGold: {
                id: "acquireGold",
                name: "Acquire Gold",
                effect(){
                    //gotta do this since pinia needs instantiating first - feels dumb but idk how to do it better
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
            }
        }
    },
    humanResources: {
        name: "Human Resources",
        desc: "The HR department of your cult",
        tier: "tier0",
        showCondition() {return true},
        buttons: {
            hireCultist: {
                id: "hireCultist",
                name: "Hire Cultist",
                effect() {
                    addCultist();
                },
                condition() {
                    const resources = useResourcesStore();
                    const misc = useMiscStore();
                    return resources.getResourceTotal("Gold") >= 20 && misc.checkCultistSpace;
                },
                showCondition() {return true}
            }
        }
    },
    mines: {
        id: "mines",
        name: "Mines",
        desc: "A mineshaft underneath your lair",
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

        }
    }
}