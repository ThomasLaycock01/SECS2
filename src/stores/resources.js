import {defineStore} from "pinia";

export const useResourcesStore = defineStore("resources", {
    state: () => {
        return {Evilness: {total: 0, perSec: 0}, Gold: {total: 0, perSec: 0}, Crystals: {total: 0, perSec: 0}, Slime: {total: 0, perSec: 0}}
    },
    getters: {
        getAll(state) {
            return {Evilness: state.Evilness, Gold: state.Gold, Crystals: state.Crystals, Slime: state.Slime};
        },
        getResourceTotal(state) {
            return (resource) => state[resource].total;
        },
        getResourcePerSec(state) {
            return (resource) => state[resource].perSec;
        }
    },
    actions: {
        modifyResource(type, amount) {
            this[type].total += amount;
        },
        setResourcePerSec(type, value) {
            this[type].perSec = value;
        }
    }
})