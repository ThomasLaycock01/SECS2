import {defineStore} from "pinia";

import { useResourcesStore } from "./resources";
import { usePartiesStore } from "../barracks/parties";

import { Building } from "@/classes/Building";

export const useBuildingsStore = defineStore("buildings", {
    state: () => {
        return {
            buildings: {

            },
            buildingTemplates: {
                chambers: {
                    id: "chambers", 
                    modifiers: [{type: "cultistLimit", modifier: 1}], 
                    costs: {"gold": 100}, 
                    exponents: {"gold": 2}, 
                    limit: 5
                },
                evilShrine: {
                    id: "evilShrine",
                     modifiers: [{type: "evilness", modifier: 0.1}], 
                     costs: {"gold": 150}, 
                     exponents: {"gold": 1.5}, 
                     limit: 5
                    },
                fightersGuild: {
                    id: "fightersGuild", 
                    costs: {"gold": 1000}, 
                    limit: 1, 
                    onBuild() {
                        const parties = usePartiesStore();
                        parties.unlockRole("fighter");
                    }
                },
                knightOutreach: {
                    id: "knightOutreach", 
                    costs: {"gold": 1000}, 
                    limit: 1, 
                    onBuild() {
                        const parties = usePartiesStore();
                        parties.unlockRole("squire");
                    }
                },
                apprenticeshipProgram: {
                    id: "apprenticeshipProgram", 
                    costs: {"gold": 1000}, 
                    limit: 1, 
                    onBuild() {
                        const parties = usePartiesStore();
                        parties.unlockRole("apprentice");
                    }
                },
                cartographerPlains: {
                    id: "cartographerPlains",
                    costs: {"gold": 4000},
                    limit: 1
                }
            }
        }
    },
    getters: {
        getOwned(state) {
            return (buildingId) => {
                return state.buildings[buildingId].getAmount();
            }
        },
        getLimit(state) {
            return (buildingId) => {
                return state.buildings[buildingId].getLimit();
            }
        },
        getBuildingModifier(state) {
            return (typeArray) => {
                var modVal = 0;

                for (var i in state.buildings) {
                    modVal += state.buildings[i].getModifiers(typeArray);
                }

                return modVal;
            }
        },
        getCosts(state) {
            return (buildingId) => {
                return state.buildings[buildingId].getCosts();
            }
        },
        checkIfAtLimit(state) {
            return (buildingId) => {
                return state.buildings[buildingId].limitCheck();
            }
        }
    },
    actions: {
        instantiateBuildings() {
            for (var i in this.buildingTemplates) {
                const building = new Building(this.buildingTemplates[i]);

                this.buildings[building.getId()] = building;
            }
        },
        build(buildingId) {
            const resources = useResourcesStore();

            const building = this.buildings[buildingId];

            resources.removeResources(building.getCosts());

            building.build();
        }
    }
});