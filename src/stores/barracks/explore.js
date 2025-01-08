import { defineStore } from "pinia";

import { Area } from "@/classes/Areas";

import areas from "@/assets/json/areas.json"

export const useExploreStore = defineStore("explore", {
    state: () => {
        return {
            areas: {
            }
        }
    },
    getters: {
        getAreas(state) {
            return state.areas;
        }
    },
    actions: {
        instantiateAreas() {
            for(var i in areas) {
                const area = new Area(areas[i]);

                this.areas[area.getId()] = area;
            }
        }
    }
})