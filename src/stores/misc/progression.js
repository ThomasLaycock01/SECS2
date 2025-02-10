import { defineStore } from "pinia";

import { useResourcesStore } from "../globalPinias/resources";
import { useCultistsStore } from "../globalPinias/cultists";

import { useTextLogStore } from "./textLog";

export const useProgressionStore = defineStore("progression", {
    state: () => {
        return {
            unlocked: [],
            unlockConditions: {
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
                        return cultists.getNumOfRegular > 0;
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

            const unlockArray= Object.keys(this.unlockConditions);

            for (var i in unlockArray) {
                if (!this.unlocked.includes(unlockArray[i])) {
                    const conditionObj = this.unlockConditions[unlockArray[i]];

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