import {defineStore} from "pinia";

import { useMinesStore } from "../mines/mines";
import { useSmelterStore } from "../mines/smelter";
import { useProgressionStore } from "../misc/progression";

import { instantiateResource, posToNeg } from "@/functions";

import resources from "@/assets/json/resources.json";

export const useResourcesStore = defineStore("resources", {
    state: () => {
        return {
            resources: {
            },
            childPinias: [
                {id:"mines", resources: [], piniaObject() {const mines = useMinesStore(); return mines}},
                {id:"smelter", resources: [], piniaObject() {const smelter = useSmelterStore(); return smelter}}
            ]
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
                switch (resource) {
                    case "evilness":
                    case "gold":
                        return state.resources[resource].total;
                    default:
                        for (var i in state.childPinias) {
                            if (state.childPinias[i].resources.includes(resource)) {
                                return state.childPinias[i].piniaObject().getResourceTotal(resource);
                            }
                        }
                }
            };
        },
        getResourcePerSec(state) {
            return (resource) => {
                switch (resource) {
                    case "evilness":
                    case "gold":
                        return state.resources[resource].perSec;
                    default:
                        for (var i in state.childPinias) {
                            if (state.childPinias[i].resources.includes(resource)) {
                                return state.childPinias[i].piniaObject().getResourcePerSec(resource);
                            }
                        }
                }
            };
        },
        getName(state) {
            return (resource) => {
                switch (resource) {
                    case "evilness":
                    case "gold":
                        return state.resources[resource].name;
                    default:
                        for (var i in state.childPinias) {
                            if (state.childPinias[i].resources.includes(resource)) {
                                return state.childPinias[i].piniaObject().getResourceName(resource);
                            }
                        }
                }
            }
        },
        getProperties(state) {
            return (resource) => {
                switch (resource) {
                    case "evilness":
                    case "gold":
                        return state.resources[resource].properties;
                    default:
                        for (var i in state.childPinias) {
                            if (state.childPinias[i].resources.includes(resource)) {
                                return state.childPinias[i].piniaObject().getResourceProperties(resource);
                            }
                        }
                }
            }
        },
        getResourcesByProperty() {
            return (property) => {
                const returnArray = [];
                for (var i in this.getAll) {
                    if (this.getAll[i].properties[property]) {
                        returnArray.push(this.getAll[i]);
                    }
                }
                return returnArray;
            }
        },
        getUnlockedResourcesByProeprty(state) {
            return (property) => {
                const returnArray = [];
                for (var i in this.getAll) {
                    if (this.getAll[i].properties[property] && !this.checkIfLocked(this.getAll[i].id)) {
                        returnArray.push(this.getAll[i]);
                    }
                }
                return returnArray;
            }
        },
        //pinias
        getAll(state) {
            var returnObj = {};

            for (var i in state.resources) {
                returnObj[i] = state.resources[i];
            }

            for (var i in state.childPinias) {
                for (var j in state.childPinias[i].piniaObject().getAll) {
                    returnObj[j] = state.childPinias[i].piniaObject().getAll[j];
                }
            }

            return returnObj;
        },
        getChildPiniaById(state) {
            return (piniaId) => {
                for (var i in state.childPinias) {
                    if (state.childPinias[i].id == piniaId) {
                        return state.childPinias[i].piniaObject(); 
                    }
                }
                
            }
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
        },
        //properties
        checkIfResourceHasProperty(state) {
            return (resourceId, propertyId) => {
                const properties = this.getProperties(resourceId);
                if (properties[propertyId] == true) {
                    return true;
                }
                return false;
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
            for (var i in this.childPinias) {
                const pinia = this.childPinias[i].piniaObject();
                pinia.updateResources();
            }
        },
        removeResources(obj) {
            for (var i in obj) {
                switch (i) {
                    case "evilness":
                    case "gold":
                        this.modifyResource(i, posToNeg(obj[i]));
                        break;
                    default:
                        for (var j in this.childPinias) {
                            if (this.childPinias[j].resources.includes(i)) {
                                this.childPinias[j].piniaObject().modifyResource(i, posToNeg(obj[i]));
                            }
                        }
                }
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
        },
        //locked/unlocked
        unlockResource(resourceId) {
            for (var i in this.childPinias) {
                if (this.childPinias[i].resources.includes(resourceId)) {
                    const pinia = this.childPinias[i].piniaObject();
                    pinia.unlockResource(resourceId);
                }
            }
        },
        //onLoad
        instantiateResources() {
            for (var i in resources) {
                for (var j in resources[i]) {
                    if (i == "global") {
                        this.resources[j] = instantiateResource(resources[i][j]);
                    }
                    else {
                        const pinia = this.getChildPiniaById(i);
                        pinia.instantiateResource(instantiateResource(resources[i][j]));
                        this.addToChildPiniaArray(i, resources[i][j].id);
                    }
                }
            }
        },
        //helper function for adding to childPinia arrays
        addToChildPiniaArray(piniaId, resourceId) {
            for (var i in this.childPinias) {
                if (this.childPinias[i].id == piniaId) {
                    this.childPinias[i].resources.push(resourceId);
                }
            }
        }
    }
})