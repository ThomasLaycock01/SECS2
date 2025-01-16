import { defineStore } from "pinia";

import { Area } from "@/classes/Areas";

import { combatRound } from "@/functions";

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
        tick() {
          for (var i in this.areas) {
            const area = this.areas[i];

            if (area.getActive()) {
                //set the area to be not active if there is no party
                if (!area.getActiveParty()) {
                    area.toggleActive();
                    continue;
                }

                //generate a new encounter if there isnt one
                if (area.getCurrentEncounter().length < 1) {
                    area.generateEncounter();
                }
                else {
                    combatRound(area);
                }
            }
          }  
        },
        instantiateAreas() {
            for(var i in areas) {
                const area = new Area(areas[i]);

                this.areas[area.getId()] = area;
            }
        }
    }
})