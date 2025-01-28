import { defineStore } from "pinia";

import { Expedition } from "@/classes/Expedition";

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
        }
    },
    actions: {
        unlockExpedition(id) {
            this.expeditions[id].unlock();
        },
        instantiateExpeditions() {
            for (var i in expeditions) {
                const expedition = new Expedition(expeditions[i]);

                this.expeditions[expedition.getId()] = expedition;
            }
        }
    }
})