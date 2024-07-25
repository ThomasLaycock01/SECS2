import {defineStore} from "pinia";

import { useMiscStore } from "./misc";
import { useExpansionsStore } from "./expansions";

export const useResourcesStore = defineStore("resources", {
    state: () => {
        return {
            resources: {
                evilness: {name: "Evilness", total: 0, perSec: 0, showCondition(){const misc = useMiscStore(); return misc.checkHasSeenConvo(1)}}, 
                gold: {name:"Gold", total: 0, perSec: 0, showCondition(){const misc = useMiscStore(); return misc.checkHasSeenConvo(2)}}, 
                crystals: {name:"Crystals", total: 0, perSec: 0, showCondition(){const expansions = useExpansionsStore(); return expansions.hasTier1}}, 
                manaCrystals: {name:"Mana Crystals", total: 0, perSec: 0, showCondition(){const expansions = useExpansionsStore(); return expansions.getBuiltTier2Id == "tower";}},
                slime: {name:"Slime",total: 0, perSec: 0, showCondition(){const misc = useMiscStore(); return misc.checkHasSeenConvo(5)}}
            }}
    },
    getters: {
        getAll(state) {
            return state["resources"];
        },
        getResourceTotal(state) {
            return (resource) => state["resources"][resource].total;
        },
        getResourcePerSec(state) {
            return (resource) => state["resources"][resource].perSec;
        },
        getSpecificResource(state) {
            return (resource) => state["resources"][resource];
        },
        getName(state) {
            return (resource) => state["resources"][resource]["name"];
        }
    },
    actions: {
        modifyResource(type, amount) {
            this["resources"][type].total += amount;
        },
        setResourcePerSec(type, value) {
            this["resources"][type].perSec = value;
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