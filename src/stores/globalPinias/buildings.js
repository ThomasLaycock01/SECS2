import {defineStore} from "pinia";

import { useResourcesStore } from "./resources";
import { useCultistsStore } from "./cultists";
import { useExpansionsStore } from "../expansions";

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
                const returnArray = [];
                
                //iterate over every built childPinia
                const expansions = useExpansionsStore();
                for (var i in state.childPinias) {

                    //lair expansion is checked always
                    if (expansions.hasExpansion(state.childPinias[i].id) || state.childPinias[i].id == "lair") {

                        //iterate over buildings in said expansion
                        for (var j in state.childPinias[i].buildings) {

                            //iterating over buildings in store (they get instnatiate on load)
                            const buildingId = state.childPinias[i].buildings[j];
                            const pinia = state.childPinias[i].piniaObject();

                            for (var k in state.buildings[i][buildingId].modifiers) {

                                const buildingNumber = pinia.getNumOfBuilding(buildingId);
                                //if there are no owned of that building, skip it
                                if (buildingNumber < 1) {
                                    break;
                                }

                                //otherwise, continue to check type and altType
                                if (state.buildings[i][buildingId].modifiers[k].type == type || state.buildings[i][buildingId].modifiers[k].type == "global") {
                                    if (altType) {
                                        if (state.buildings[i][buildingId].modifiers[k].altType == altType || !state.buildings[i][buildingId].modifiers[k].altType) {
                                            const modifierObj = {modifier: state.buildings[i][buildingId].modifiers[k].modifier * buildingNumber};
                                            returnArray.push(modifierObj);
                                        }
                                    }
                                    else {
                                        if (!state.buildings[i][buildingId].modifiers[k].altType) {
                                            const modifierObj = {modifier: state.buildings[i][buildingId].modifiers[k].modifier * buildingNumber};
                                            returnArray.push(modifierObj);
                                        }
                                    }
                                    
                                }
                            }
                        }
                    }
                }
                return returnArray;
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
                    case "recalcRegularLimit":
                        cultists.calculateRegularLimit();
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