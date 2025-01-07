import { defineStore } from "pinia";

import expeditions from "@/assets/json/expeditions.json";
import enemies from "@/assets/json/enemies.json";


export const useExpeditionsStore = defineStore("expeditions", {
    state: () => {
        return {
            expeditions: {

            },
            enemies: {

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
            this.enemies = enemies;
        }
    }
})