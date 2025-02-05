import { defineStore } from "pinia";

import { useResourcesStore } from "../globalPinias/resources";

export const useProgressionStore = defineStore("progression", {
    state: () => {
        return {
            unlocked: [],
            unlockConditions: {
                "10Evilness": {
                    id: "10Evilness",
                    condition() {
                        const resources = useResourcesStore();
                        return resources.checkIfCanAfford({"evilness": 10})
                    }
                }
            }
        }
    },
    getters: {

    },
    actions: {
        updateProgression() {
            const unlockArray= Object.keys(this.unlockConditions);

            for (var i in unlockArray) {
                if (!this.unlocked.includes(unlockArray[i])) {
                    const conditionObj = this.unlockConditions[unlockArray[i]];

                    if (conditionObj.condition()) {
                        this.unlocked.push(unlockArray[i]);
                    }
                }
            }
        }
    }
})