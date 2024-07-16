import {defineStore} from "pinia";

import { useMiscStore } from "./misc";

export const useResourcesStore = defineStore("resources", {
    state: () => {
        return {
            resources: {
                Evilness: {total: 0, perSec: 0, showCondition(){const misc = useMiscStore(); return misc.checkHasSeenConvo(1)}}, 
                Gold: {total: 0, perSec: 0, showCondition(){const misc = useMiscStore(); return misc.checkHasSeenConvo(2)}}, 
                Crystals: {total: 0, perSec: 0, showCondition(){const misc = useMiscStore(); return misc.checkHasSeenConvo(3)}}, 
                Slime: {total: 0, perSec: 0, showCondition(){const misc = useMiscStore(); return misc.checkHasSeenConvo(3)}}
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
        }
    },
    actions: {
        modifyResource(type, amount) {
            this["resources"][type].total += amount;
        },
        setResourcePerSec(type, value) {
            this["resources"][type].perSec = value;
        },
        loadData(data) {
            for (var i in data) {
                this["resources"][i] = data[i];
            }
        }
    }
})