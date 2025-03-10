import { defineStore } from "pinia";

import { useResourcesStore } from "../globalPinias/resources";
import { useCultistsStore } from "../globalPinias/cultists";
import { useExpeditionsStore } from "../barracks/expeditions";

import { useTextLogStore } from "./textLog";

export const useProgressionStore = defineStore("progression", {
    state: () => {
        return {
            unlocked: [],
            checkedProgression: {
                "10Evilness": {
                    id: "10Evilness",
                    TLMessage: true,
                    condition() {
                        const resources = useResourcesStore();
                        return resources.checkIfCanAfford({"evilness": 10});
                    }
                },
                "firstCultist": {
                    id: "firstCultist",
                    TLMessage: true,
                    condition() {
                        const cultists = useCultistsStore();
                        return cultists.getNumOfCultists > 0;
                    }
                },
                "abandondedFarmhouseUnlocked": {
                    id: "abandondedFarmhouseUnlocked",
                    TLMessage: true,
                    condition() {
                        const expeditions = useExpeditionsStore();
                        return expeditions.checkIfExpeditionUnlocked("abandonedFarmhouse")
                    }
                },
                "completedExpedition": {
                    id:"completedExpedition",
                    TLMessage: false,
                    condition() {
                        const expeditions = useExpeditionsStore();
                        return expeditions.checkIfExpeditionCompleted("abandonedFarmhouse");
                    }
                }
            }
        }
    },
    getters: {
        checkUnlocked(state) {
            return (unlockId) => {
                if (state.unlocked.includes(unlockId)) {
                    return true;
                }
                return false;
            }
        }
    },
    actions: {
        updateProgression() {
            const textLog = useTextLogStore();

            const unlockArray= Object.keys(this.checkedProgression);

            for (var i in unlockArray) {
                if (!this.unlocked.includes(unlockArray[i])) {
                    const conditionObj = this.checkedProgression[unlockArray[i]];

                    if (conditionObj.condition()) {
                        this.unlocked.push(unlockArray[i]);
                        if (conditionObj.TLMessage) {
                            textLog.addMessageToLog(conditionObj.id);
                        }
                    }
                }
            }
        }
    }
})