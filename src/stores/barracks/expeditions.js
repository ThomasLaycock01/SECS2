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
            const returnArray = [];
            for (var i in state.expeditions) {
                if (state.expeditions[i].getUnlocked()) {
                    returnArray.push(state.expeditions[i]);
                }
            }
            return returnArray;
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
        tick(combat = false) {
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
                    else if (combat) {
                        combatRound(expedition);
                    }
                }
            }
        },
        unlockExpedition(id) {
            const progression = useProgressionStore();

            console.log(id);
            console.log(this.expeditions[id])
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