import {defineStore} from "pinia";

import { useResourcesStore } from "./resources";
import { useCultistsStore } from "./cultists";

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
        buildBuilding(pinia, buildingId) {
            const resources = useResourcesStore();

            const costs = this.childPinias[pinia].piniaObject().buildBuilding(buildingId);

            resources.removeResources(costs);

            const effects = this.getOnBuildEffects(pinia, buildingId);

            this.resolveOnBuildEffects(effects);
        },
        resolveOnBuildEffects(effectArray) {
            const cultists = useCultistsStore();

            for (var i in effectArray) {
                switch (effectArray[i]) {
                    case "recalcCultistLimit":
                        cultists.calculateCultistLimit();
                        break;
                    default:
                        break;
                }
            }

        }
    }
});