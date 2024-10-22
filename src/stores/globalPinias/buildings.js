import {defineStore} from "pinia";

import { useResourcesStore } from "./resources";
import { useCultistsStore } from "./cultists";

import { useLairStore } from "../lair";
import { useMinesStore } from "../mines";

import buildings from "../../assets/json/buildings.json";

export const useBuildingsStore = defineStore("buildings", {
    state: () => {
        return {
            buildings: {

            },
            childPinias: {
                lair: {id:"lair", buildings: ["chambers", "evilShrine"], piniaObject() {const lair = useLairStore(); return lair}},
                mines: {id:"mines", buildings: ["tunnel", "prospector1", "prospector2"], piniaObject() {const mines = useMinesStore(); return mines}}
            }
        }
    },
    getters: {
        getNumOfBuildings(state) {
            return (buildingId) => {
                for (var i in state.childPinias) {
                    if (state.childPinias[i].buildings.includes(buildingId)) {
                        return state.childPinias[i].piniaObject().getNumOfBuilding(buildingId);
                    }
                }
            }
        },
        checkBuildingReqs(state) {
            return (buildingsObj) => {
                for (var i in buildingsObj) {
                    if (this.getNumOfBuildings(i) < buildingsObj[i]) {
                        return false;
                    }
                }
                return true;
            }
        },
        getBuildingModifier(state) {
            return (type, altType = null) => {
                var totalMod = 0;
                for (var i in state.childPinias) {
                    for (var j in state.childPinias[i].buildings) {
                        const buildingId = state.childPinias[i].buildings[j];
                        for (var k in state.buildings[i][buildingId].modifiers) {
                            if (state.buildings[i][buildingId].modifiers[k].type == type || state.buildings[i][buildingId].modifiers[k].type == "global") {
                                if (altType) {
                                    if (state.buildings[i][buildingId].modifiers[k].altType == altType || !state.buildings[i][buildingId].modifiers[k].altType) {
                                        const modifierObj = state.buildings[i][buildingId].modifiers[k];
                                        totalMod += modifierObj.modifier * state.getNumOfBuildings(buildingId);
                                    }
                                }
                                else {
                                    if (!state.buildings[i][buildingId].modifiers[k].altType) {
                                        const modifierObj = state.buildings[i][buildingId].modifiers[k];
                                        totalMod += modifierObj.modifier * state.getNumOfBuildings(buildingId);
                                    }
                                }
                                
                            }
                        }
                    }
                }
                return totalMod;
            }
        },
        getOnBuildEffects(state) {
            return (pinia, buildingId) => {
                return state.buildings[pinia][buildingId].onBuildEffects;
            }
        }
    },
    actions: {
        instantiateBuildings() {
            this.buildings = buildings;
        },
        buildBuildings(pinia, buildingId) {
            const resources = useResourcesStore();

            const costs = this.childPinias[pinia].piniaObject().buildBuilding(buildingId);

            resources.removeResources(costs);

            const effects = this.getOnBuildEffects(pinia, buildingId);

            this.resolveOnBuildEffects(effects);
            
            this.childPinias[pinia].piniaObject().updateBuildingCost(buildingId);
        },
        resolveOnBuildEffects(effectArray) {
            const cultists = useCultistsStore();
            const resources = useResourcesStore();

            for (var i in effectArray) {
                switch (effectArray[i].type) {
                    case "recalcCultistLimit":
                        cultists.calculateCultistLimit();
                        break;
                    case "unlockResource":
                        resources.unlockResource(effectArray[i].resource);
                        break;
                    default:
                        break;
                }
            }

        }
    }
});