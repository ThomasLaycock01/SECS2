import { defineStore } from "pinia";

import { useResourcesStore } from "./globalPinias/resources";
import { useCultistsStore } from "./globalPinias/cultists";
import { useInventoryStore } from "./globalPinias/inventory";
import { useExpansionsStore } from "./expansions";

import items from "../assets/json/items.json";

export const useMinesStore = defineStore("mines", {
    state: () => {
        return {
            actions: {
                actions: {
                    id: "actions",
                    name: "Actions",
                    buttons : {
                        testButton: {
                            id: "testButton",
                            name: "Test button",
                            desc: "Hire a Human Cultist",
                            condition() {
                                return true;
                            },
                            showCondition() {
                                return true;
                            },
                            effect() {
                                const mines = useMinesStore();
                                mines.createItem(1000)
                            }
                        },
                        testButton2: {
                            id: "testButton2",
                            name: "Test button 2",
                            desc: "Hire a Human Cultist",
                            condition() {
                                return true;
                            },
                            showCondition() {
                                return true;
                            },
                            effect() {
                                const mines = useMinesStore();
                                mines.createItem(1001)
                            }
                        }
                    }
                },
                buildings: {
                    id: "buildings",
                    name: "Buildings",
                    buttons: {

                    }
                }
            },
            workers: {
                overseer: null,
                workerArray: []
            },
            resources: {
                stone: {
                    id:"stone",
                    name:"Stone",
                    total: 0, 
                    perSec: 0, 
                    showCondition(){
                        const expansions = useExpansionsStore(); 
                        return expansions.hasTier(1);
                    }, 
                    unlockCondition() {
                        return true;
                    }
                },
                scavenge: {
                    id:"scavenge",
                    name:"Scavenge",
                    total: 0, 
                    perSec: 0, 
                    showCondition(){
                        return false;
                    }, 
                    unlockCondition() {
                        return true;
                    }
                }
            },
            items: {
            },
            misc: {
                workerJobName: "Miner",
                overseerJobName: "Mine Overseer",
                workerXp: 1,
                overseerXp: 2
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
        },
        getWorkerArray(state) {
            return state.workers.workerArray;
        },
        getNumOfWorkers(state) {
            return state.workers.workerArray.length;
        },
        //items
        getItems(state) {
            return this.items;
        },
        //misc
        getWorkerJobName(state) {
            return state.misc.workerJobName;
        },
        getOverseerJobName(state) {
            return state.misc.overseerJobName;
        },
        getWorkerXpAmount(state) {
            return state.misc.workerXp;
        },
        getOverseerXpAmount(state) {
            return state.misc.overseerXp;
        }
    },
    actions: {
        //tick
        tick() {
            //pinia stores
            const cultists = useCultistsStore();
            //first - get overseer modifier
            const overseerMod = this.getOverseerModifier();

            //second - calculate output of each resource
            for (var i in this.getResources) {
                var resourceOutput = 0;
                for (var j in this.getWorkerArray) {
                    if (this.getWorkerArray[j].resource == i) {
                        const cultist = cultists.getCultistById(this.getWorkerArray[j].id);
                        //output 
                        resourceOutput += 1 *( 1 + cultist.getGlobalModifiers("mineWorker") + cultist.getModifiersByType("mineWorker", i));
                    }
                }
                this.resources[i].perSec = Math.round(resourceOutput * overseerMod * 100) / 100;
                this.resources[i].total += this.resources[i].perSec;
            }

            //scavenge stuff
            if (this.getResourceTotal("scavenge") >= 100) {
                this.resources["scavenge"].total -= 100;
                this.completeScavenge();
            }

            //adding XP
            for (var i in this.getWorkerArray) {
                const cultist = cultists.getCultistById(this.getWorkerArray[i].id);
                cultist.addXp(this.getWorkerXpAmount);
            }

            if (this.getOverseer && this.getNumOfWorkers > 0) {
                const overseer = this.getOverseer;
                overseer.addXp(this.getOverseerXpAmount);
            }

        },
        //resources
        modifyResource(resource, amount) {
            this.resources[resource].total += amount;
        },
        setResourcePerSec(resource, amount) {
            this.resources[resource].perSec = amount;
        },
        //items
        instantiateItems() {
            this.items = items.mines;
        },
        createItem(itemId) {
            const inventory = useInventoryStore();
            const object = this.items[itemId];
            inventory.addItem(object);
        },
        giveRandItem(tier) {
            var tierArray = [];
            for (var i in this.getItems) {
                if (this.getItems[i].tier == tier) {
                    tierArray.push(this.getItems[i]);
                }
            }

            const index = Math.floor(Math.random() * tierArray.length)

            this.createItem(tierArray[index].itemId);
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
        },
        addWorker(obj) {
            this.workers.workerArray.push(obj);
        },
        removeWorker(cultistId) {
            this.workers.workerArray = this.workers.workerArray.filter((obj) => obj.id != cultistId);
        },
        //saving/loading
        /*saveData() {
            var data = JSON.parse(localStorage.getItem("SECSData"));

            data.mines = this.workers;

            localStorage.setItem("SECSData", JSON.stringify(data));
        },
        loadData() {
            var data = JSON.parse(localStorage.getItem("SECSData"));

            this.workers = data.mines;
        },*/
        //misc
        completeScavenge() {
            const index = Math.random();

            if (index >= 0.9) {
                this.giveRandItem(1);
            }
            else {
                this.giveRandItem(0);
            }
        }
    }
})