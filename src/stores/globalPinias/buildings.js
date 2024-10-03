import {defineStore} from "pinia";

import { useResourcesStore } from "./resources";

import { useLairStore } from "../lair";

import buildings from "../../assets/json/buildings.json";

export const useBuildingsStore = defineStore("buildings", {
    state: () => {
        return {
            buildings: {

            },
            childPinias: {
                lair: {id:"lair", buildings: ["chambers"], piniaObject() {const lair = useLairStore(); return lair}}
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
        getTotalBuildingModifier(state) {
            return (modifierId) => {
                var totalMod = 0;
                for (var i in state.childPinias) {
                    for (var j in state.childPinias[i].buildings) {
                        const buildingId = state.childPinias[i].buildings;
                        if (state.buildings[i][buildingId].modifiers[modifierId]) {
                            const building = state.buildings[i][buildingId];
                            totalMod += building.modifiers[modifierId] * state.getNumOfBuildings(building.id);
                        }
                    }
                }
                return totalMod;
            }
        }
    },
    actions: {
        instantiateBuildings() {
            this.buildings = buildings;
        },
        buildBuilding(pinia, buildingId) {
            const resources = useResourcesStore();

            const costs = this.childPinias[pinia].piniaObject().buildBuilding(buildingId);

            resources.removeResources(costs);
        }
    }
});