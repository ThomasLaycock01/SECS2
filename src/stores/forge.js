import { defineStore } from "pinia";

import { useResourcesStore } from "./globalPinias/resources";
import { useExpansionsStore } from "./expansions";
import { useCultistsStore } from "./globalPinias/cultists";

export const useForgeStore = defineStore("forge", {
    state: () => {
        return {
            actions: {
                actions: {
                    id: "actions",
                    name: "Actions",
                    tooltipType: "action",
                    buttons : {
                        beEvil2: {
                            id: "beEvil2",
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
                        }
                    }
                }
            },
            workers: {
                overseer: null,
                workerArray: []
            },
            resources: {
                copperBars: {
                    id:"copperBars",
                    name:"Copper Bars",
                    total: 0,
                    perSec: 0,
                    consumedPerSec: 0, 
                    showCondition() {
                        const expansions = useExpansionsStore();
                        return expansions.hasTier(2);
                    },
                    unlockCondition() {
                        return true;
                    }
                }
            }
        }
    },
    getters: {
        //actions
        getActions(state) {
            return state.actions;
        },
        //resources
        getResources(state) {
            return state.resources;
        },
        getResourceObject(state) {
            return (id) => state.resources[id];
        },
        getResourceTotal(state) {
            return (id) => state.resources[id].total;
        },
        getResourcePerSec(state) {
            return (id) => state.resources[id].perSec;
        },
        getUnlockResources(state) {
            const returnArray = [];
            for (var i in state.resources) {
                if (state.resources[i].unlockCondition()) {
                    returnArray.push(state.resources[i]);
                }
            }
            return returnArray;
        },
        //workers
        getOverseer(state) {
            if (state.workers.overseer == null) {
                return null;
            }
            const cultists = useCultistsStore();
            return cultists.getCultistById(state.workers.overseer);
        }
    },
    actions: {
        tick() {
            console.log("forge tick")
        },
        //resources
        modifyResource(resource, amount) {
            this.resources[resource].total += amount;
        },
        setResourcePerSec(resource, amount) {
            this.resources[resource].perSec = amount;
        },
        //workers
        assignOverseer(cultistId) {
            this.workers.overseer = cultistId;
        },
        removeOverseer() {
            this.workers.overseer = null;
        },
        getOverseerModifier() {
            const overseer = this.getOverseer;
            if (overseer == null) {
                return 0.5;
            }

            return overseer.getGlobalModifiers("mineOverseer") + 1;
        }
    }
})