import { defineStore } from "pinia";

import { Expedition } from "@/classes/Expedition";

import { combatRound } from "@/functions";

import expeditions from "@/assets/json/expeditions.json";
import { useProgressionStore } from "../misc/progression";

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
            if (Object.keys(this.activeExpedition).length) {
                //auto retreat if everyone is knocked out
                if (this.activeExpedition.getActiveParty().checkFullKnockOut()) {
                    this.activeExpedition.endExpedition();
                }
                //generate next encounter if there isnt one
                else if (this.activeExpedition.getCurrentEncounter().length < 1) {
                    this.activeExpedition.generateNextEncounter();
                }
                else {
                    combatRound(this.activeExpedition);
                }
            }
        },
        unlockExpedition(id) {
            const progression = useProgressionStore();

            this.expeditions[id].unlock();

            progression.updateProgression();
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