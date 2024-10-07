import { defineStore } from "pinia";



export const useForgeStore = defineStore("forge", {
    state: () => {
        return {

        }
    },
    getters: {

    },
    actions: {
        tick() {
            console.log("forge tick")
        }
    }
})