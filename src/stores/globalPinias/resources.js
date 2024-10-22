import {defineStore} from "pinia";

import { useMinesStore } from "../mines";
import { useForgeStore } from "../forge";

import { instantiateResource, posToNeg } from "@/functions";

import resources from "@/assets/json/resources.json";

export const useResourcesStore = defineStore("resources", {
    state: () => {
        return {
            resources: {
            },
            childPinias: [
                {id:"mines", resources: [], piniaObject() {const mines = useMinesStore(); return mines}},
                {id:"forge", resources: [], piniaObject() {const forge = useForgeStore(); return forge}}
            ],
            lockedResources: []
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
        getResourcesByProperty(state) {
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
                console.log(piniaId);
                for (var i in state.childPinias) {
                    if (state.childPinias[i].id == piniaId) {
                        return state.childPinias[i].piniaObject(); 
                    }
                }
                
            }
        },
        //locked/unlocked
        getLocked(state) {
            return state.lockedResources;
        },
        checkIfLocked(state) {
            return (resourceId) => {
                return state.lockedResources.includes(resourceId);
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
            this.resources[type].total += amount;
            this.updatedLocked();
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
        updatedLocked() {
            for (var i in this.getLocked) {
                if (this.getResourceTotal(this.getLocked[i]) != 0) {
                    this.lockedResources.splice(i, 1);
                }
            }
        },
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
                    if (!this.lockedResources.includes(resources[i][j].id)) {
                        this.lockedResources.push(resources[i][j].id);
                    }

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