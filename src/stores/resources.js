import {defineStore} from "pinia";

import { useMinesStore } from "./mines";

export const useResourcesStore = defineStore("resources", {
    state: () => {
        return {
            resources: {
                evilness: {id:"evilness",
                    name: "Evilness",
                    total: 0,
                    perSec: 0,
                    showCondition(){
                        return true}},
                gold: {
                    id:"gold", 
                    name:"Gold", 
                    total: 0, 
                    perSec: 0, 
                    showCondition(){
                        return true}}
            },
            childPinias: [{id:"mines", resources: ["stone"], piniaObject() {const mines = useMinesStore(); return mines}}]
        }
    },
    getters: {
        getGlobal(state) {
            return state.resources;
        },
        getResourceTotal(state) {
            return (resource) => state.resources[resource].total;
        },
        getResourcePerSec(state) {
            return (resource) => state.resources[resource].perSec;
        },
        getSpecificResource(state) {
            return (resource) => state.resources[resource];
        },
        getName(state) {
            return (resource) => state.resources[resource].name;
        },
        //pinias
        getChildPinias(state) {
            return state.childPinias;
        }
    },
    actions: {
        modifyResource(type, amount) {
            this.resources[type].total += amount;
        },
        setResourcePerSec(type, value) {
            this.resources[type].perSec = value;
        },
        checkIfCanAfford(costsObj) {
            var canAfford = true;
            for (var i in costsObj) {
                if (this.getResourceTotal(i) < costsObj[i]) {
                    canAfford = false;
                }
            }

            return canAfford;
            //might not be necessary, but keep around as reference for how to grab the child pinias
            /*for (var i in costsObj) {
                if (this.getGlobal[i]) {
                    //this can be used to grab resources from this pinia
                    
                } 
                else {
                    for (var j in this.getChildPinias) {
                        if (this.getChildPinias[j].resources.includes(i)) {
                            //this can be used to grab resources from the other pinias
                        }
                    }
                }
            }*/
        },
        saveData() {
            var data = JSON.parse(localStorage.getItem("SECSData"));

            const resourceObject = {};

            for (var i in this["resources"]) {
                resourceObject[i] = {total: this["resources"][i].total, perSec: this["resources"][i].perSec};
            }

            data.resources = resourceObject;

            localStorage.setItem("SECSData", JSON.stringify(data));

        },
        loadData() {

            const data = JSON.parse(localStorage.getItem("SECSData"));

            const resources = data.resources;

            for (var i in resources) {
                const resource = resources[i];
                this["resources"][i].total = resource.total;
                this["resources"][i].perSec = resource.perSec;
            }
        }
    }
})