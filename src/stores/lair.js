import { defineStore } from "pinia";

import { useResourcesStore } from "./resources";

export const useMinesStore = defineStore("lair", {
    state: () => {
        return {
            actions: {
                beEvil: {
                    id: "beEvil",
                    name: "Be Evil >:)",
                    desc: "Be Evil - and Gain 1 Evilness",
                    condition() {
                        return true;
                    },
                    showCondition() {
                        return true;
                    },
                    effect() {
                        const resources = useResourcesStore();
                        resources.modifyResource("evilness", 1)
                    }
                },
                acquireGold: {
                    id: "acquireGold",
                    name: "Acquire Gold",
                    desc: "Acquire 1 Gold?",
                    condition() {
                        return true;
                    },
                    showCondition() {
                        return true;
                    },
                    effect() {
                        const resources = useResourcesStore();
                        resources.modifyResource("gold", 1)
                    }
                }
            },
            misc: {
                workerJobName: "Miner",
                overseerJobName: "Mine Overseer"
            }
        }
    },
    getters: {

    },
    actions: {
    }
})