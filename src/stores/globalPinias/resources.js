import {defineStore} from "pinia";

import { useProgressionStore } from "../misc/progression";

import { posToNeg } from "@/functions";

export const useResourcesStore = defineStore("resources", {
    state: () => {
        return {
            resources: {
                evilness: {id: "evilness", name: "Evilness", total: 0, perSec: 0},
                gold: {id: "gold", name: "Gold", total: 0, perSec: 0},
                grain: {id: "grain", name: "Grain", total: 0, perSec: 0}
            }
        }
    },
    getters: {
        getGlobal(state) {
            return state.resources;
        },
        //function specifically for getting evilness
        getEvilness(state) {
            return state.resources["evilness"].total;
        },
        //generally, dont use this one for getting evilness
        getResourceTotal(state) {
            return (resource) => {
                return state.resources[resource].total;
            };
        },
        getResourcePerSec(state) {
            return (resource) => {
                return state.resources[resource].perSec;
            };
        },
        getName(state) {
            return (resource) => {
                        return state.resources[resource].name;
            };
        },
        //locked/unlocked
        checkIfLocked(state) {
            return (resourceId) => {
                for (var i in state.childPinias) {
                    if (state.childPinias[i].resources.includes(resourceId)) {
                        const piniaObj = state.childPinias[i].piniaObject();
                        return piniaObj.checkIfLocked(resourceId);
                    }
                }
            }
        }
    },
    actions: {
        modifyResource(type, amount) {
            const progression = useProgressionStore();

            this.resources[type].total += amount;

            progression.updateProgression();
        },
        setResourcePerSec(type, value) {
            this.resources[type].perSec = value;
        },
        updateResources() {
            for (var i in this.resources) {
                this.modifyResource(i, this.resources[i].perSec)
            }
        },
        removeResources(obj) {
            for (var i in obj) {
                this.modifyResource(i, posToNeg(obj[i]));
            }
        },
        checkIfCanAfford(costsObj) {
            var canAfford = true;
            for (var i in costsObj) {
                if (this.getResourceTotal(i) < costsObj[i]) {
                    canAfford = false;
                }
            }

            return canAfford;
        }
    }
})