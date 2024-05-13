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
            expansionLaboratory: {
                id: "expansionLaborator",
                name: "Expansion: Laboratory",
                effect(){
                    buildExpansion("laboratory");
                },
                condition(){
                    const resources = useResourcesStore();
                    return resources.getResourceTotal("Gold") >= 30;
                },
                showCondition() {
                    const expansions = useExpansionsStore();
                    return expansions.hasTier0 == false;
                }
            }
        }
    },
    humanResources: {
        name: "Human Resources",
        desc: "The HR department of your cult",
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
        name: "Mines",
        desc: "A mineshaft underneath your lair",
        showCondition() {return true},
        buttons: {
            goldMine: {
                id: "goldMine",
                name: "Gold Mine",
                effect() {
                    buildBuilding("goldMine")
                },
                condition() {
                    const resources = useResourcesStore();
                    const buildings = useBuildingsStore();
                    
                    const costs = buildings.getBuildingCostsById("goldMine");

                    var canAfford = true;

                    for (var i in costs) {
                        if (resources.getResourceTotal(i) < costs[i]) {
                            canAfford = false;
                        }
                    }

                    return canAfford;
                },
                showCondition() {return true}
            }
        }
    }
}