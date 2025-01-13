import { defineStore } from "pinia";

import expeditions from "@/assets/json/expeditions.json";

export const useExpeditionsStore = defineStore("expeditions", {
    state: () => {
        return {
            expeditions: {

            },
            activeExpedition: {

            }
        }
    },
    getters: {
        getAvailableExpeditions(state) {
            //just returns them all rn
            return state.expeditions;
        },
        getExpeditionLength(state) {
            return (id) => Object.keys(state.expeditions[id].encounters).length;
        }
    },
    actions: {
        instantiateExpeditions() {
            this.expeditions = expeditions;
        }
    }
})