import { defineStore } from "pinia";

import { Expedition } from "@/classes/Expedition";

import { combatRound } from "@/functions";

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
        getActiveExpedition(state) {
            if (!Object.keys(state.activeExpedition).length) {
                return null;
            }
            return state.activeExpedition;
        },
        checkIfExpeditionCompleted(state) {
            return (expeditionId) => {
                return state.expeditions[expeditionId].getCompleted();
            }
        }
    },
    actions: {
        tick() {
            if (Object.keys(this.activeExpedition).length) {
                //generate next encounter if there isnt one
                if (this.activeExpedition.getCurrentEncounter().length < 1) {
                    this.activeExpedition.generateNextEncounter();
                }
                else {
                    combatRound(this.activeExpedition);
                }
            }
        },
        unlockExpedition(id) {
            this.expeditions[id].unlock();
        },
        setActiveExpedition(id) {
            this.activeExpedition = this.expeditions[id];
        },
        unsetActiveExpedition() {
            this.activeExpedition = {};
        },
        instantiateExpeditions() {
            for (var i in expeditions) {
                const expedition = new Expedition(expeditions[i]);

                this.expeditions[expedition.getId()] = expedition;
            }
        }
    }
})