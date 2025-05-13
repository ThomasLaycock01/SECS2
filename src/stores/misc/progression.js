import { defineStore } from "pinia";

import { useResourcesStore } from "../globalPinias/resources";
import { useCultistsStore } from "../globalPinias/cultists";
import { useExpeditionsStore } from "../barracks/expeditions";
import { usePartiesStore } from "../barracks/parties";

import { useTextLogStore } from "./textLog";
import { useInventoryStore } from "../globalPinias/inventory";

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
                "1000Evilness": {
                    id: "1000Evilness",
                    TLMessage: false,
                    condition() {
                        const resources = useResourcesStore();
                        return resources.checkIfCanAfford({"evilness": 1000});
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
                "firstRole": {
                    id: "firstRole",
                    TLMessage: false,
                    condition() {
                        const cultists = useCultistsStore();
                        for (var i in cultists.getCultists) {
                            if (cultists.getCultists[i].getRole()) {
                                return true;
                            }
                        }
                        return false;
                    }
                },
                "firstParty": {
                    id: "firstParty",
                    TLMessage: true,
                    condition() {
                        const parties = usePartiesStore();
                        return parties.getNumOfParties > 0;
                    }
                },
                "firstItem": {
                    id: "firstItem",
                    TLMessage: false,
                    condition() {
                        const inventory = useInventoryStore();
                        return inventory.getnumOfitems > 0;
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
                "completedAbandonedFarmhouse": {
                    id:"completedAbandonedFarmhouse",
                    TLMessage: false,
                    condition() {
                        const expeditions = useExpeditionsStore();
                        return expeditions.checkIfExpeditionCompleted("abandonedFarmhouse");
                    }
                },
                "completedBanditHideout": {
                    id:"completedBanditHideout",
                    TLMessage: false,
                    condition() {
                        const expeditions = useExpeditionsStore();
                        return expeditions.checkIfExpeditionCompleted("banditHideout");
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