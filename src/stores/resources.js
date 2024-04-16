import {defineStore} from "pinia";

export const useResourcesStore = defineStore("resources", {
    state: () => {
        return {Evilness: 0, Gold: 0, Crystals: 0}
    },
    actions: {
        modifyResource(type, amount) {
            this[type] += amount;
        }
    }
})