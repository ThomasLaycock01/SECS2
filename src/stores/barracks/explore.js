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
        },
        getAreaLevel(state) {
            return (levelId) => {
                return state.areas[levelId].getMaxLevel();
            }
        }
    },
    actions: {
        tick(combat = false) {
          for (var i in this.areas) {
            const area = this.areas[i];

            if (area.getActive()) {
                //set the area to be not active if there is no party
                if (!area.getActiveParty() || area.getActiveParty().checkFullKnockOut()) {
                    area.toggleActive();
                    continue;
                }

                //generate a new encounter if there isnt one
                if (area.getCurrentEncounter().length < 1) {
                    area.generateEncounter();
                }
                else if (combat) {
                    combatRound(area);
                }
            }
            else {
                area.checkAutoEmbark();
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