import {defineStore} from "pinia";

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
        
    },
    actions: {
        instantiateBuildings() {
            this.buildings = buildings;
        },
        buildBuilding(pinia, buildingId) {
            this.childPinias[pinia].piniaObject().buildBuilding(buildingId);
        }
    }
});