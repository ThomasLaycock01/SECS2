import { defineStore } from "pinia";

import { Expedition } from "@/classes/Expedition";

import { combatRound } from "@/functions";

import expeditions from "@/assets/json/expeditions.json";
import { useProgressionStore } from "../misc/progression";

export const useExpeditionsStore = defineStore("expeditions", {
    state: () => {
        return {
            expeditions: {
            }
        }
    },
    getters: {
        getAvailableExpeditions(state) {
            //just returns them all rn
            return state.expeditions;
        },
        checkIfExpeditionUnlocked(state) {
            return (expeditionId) => {
                return state.expeditions[expeditionId].getUnlocked();
            }
        },
        checkIfExpeditionCompleted(state) {
            return (expeditionId) => {
                return state.expeditions[expeditionId].getCompleted();
            }
        }
    },
    actions: {
        tick() {
            for (var i in this.expeditions) {
                const expedition = this.expeditions[i];
                
                if (expedition.getActive()) {
                    //auto-retreat if full knock out
                    if (expedition.getActiveParty().checkFullKnockOut()) {
                        expedition.endExpedition();
                    }
                    else if (expedition.getCurrentEncounter().length < 1) {
                        expedition.generateNextEncounter();
                    }
                    else {
                        combatRound(expedition);
                    }
                }
            }
        },
        unlockExpedition(id) {
            const progression = useProgressionStore();

            this.expeditions[id].unlock();

            progression.updateProgression();
        },
        instantiateExpeditions() {
            for (var i in expeditions) {
                const expedition = new Expedition(expeditions[i]);

                this.expeditions[expedition.getId()] = expedition;
            }
        }
    }
})