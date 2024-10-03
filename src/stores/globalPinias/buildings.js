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