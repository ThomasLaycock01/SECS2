import {defineStore} from "pinia";

import { useResourcesStore } from "./resources";
import { useCultistsStore } from "./cultists";
import { useExpansionsStore } from "../globalPinias/expansions";

import { useLairStore } from "../lair";

import { Building } from "@/classes/Building";

import buildings from "../../assets/json/buildings.json";

export const useBuildingsStore = defineStore("buildings", {
    state: () => {
        return {
            buildings: {

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
            for (var i in buildings) {
                const building = new Building(buildings[i]);

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