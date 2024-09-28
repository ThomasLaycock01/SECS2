import { defineStore } from "pinia";

import { useCultistsStore } from "./cultists";
import { useInventoryStore } from "./inventory";
import { useExpansionsStore } from "./expansions";

import items from "../assets/json/items.json";

export const useMinesStore = defineStore("mines", {
    state: () => {
        return {
            actions: {
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
            },
            workers: {
                overseer: null,
                workerArray: []
            },
            resources: {
                stone: {id:"stone", name:"Stone", total: 0, perSec: 0, 
                    showCondition(){
                        const expansions = useExpansionsStore(); 
                        return expansions.hasTier1;
                    }, 
                    unlockCondition() {
                        return true;
                }}
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
        //workers
        getOverseer(state) {
            if (state.workers.overseer == null) {
                return null;
            }
            const cultists = useCultistsStore();
            return cultists.getCultistById(state.workers.overseer);
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
        getWorkerArray(state) {
            return this.workers.workerArray;
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
                        //general output of cultists with level modifier
                        resourceOutput += 1 * cultist.getModifiersByType("mineWorker");
                    }
                }
                this.resources[i].perSec = Math.round(resourceOutput * overseerMod * 100) / 100;
                this.resources[i].total += this.resources[i].perSec;
            }

            //adding XP
            for (var i in this.getWorkerArray) {
                const cultist = cultists.getCultistById(this.getWorkerArray[i].id);
                cultist.addXp(this.getWorkerXpAmount);
            }

            if (this.getOverseer) {
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
            console.log(object);
            inventory.addItem(object);
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
            var mod = 1 + (0.1 * (overseer.getLevel() - 1));

            for (var i in overseer.getModifiersByType("mineOverseer")) {
                console.log(i);
                //come back and finihs this once modifiers are fully implmented
            }

            return mod;
        },
        addWorker(obj) {
            this.workers.workerArray.push(obj);
        },
        removeWorker(cultistId) {
            this.workers.workerArray = this.workers.workerArray.filter((obj) => obj.id != cultistId);
        },
        getCultistArray() {
            const cultists = useCultistsStore();

            const cultistArray = [];

            for (var i in this.workers.workerArray) {
                const cultist = cultists.getCultistById(this.workers.workerArray[i].id);
                const resource = this.getResourceObject(this.workers.workerArray[i].resource )
                const obj = {
                    cultist: cultist,
                    resource: resource
                }
                cultistArray.push(obj);
                cultist.setJob(this.getWorkerJobName)
            }

            console.log(cultistArray);

            return cultistArray;
        },
        //saving/loading
        saveData() {
            var data = JSON.parse(localStorage.getItem("SECSData"));

            data.mines = this.workers;

            localStorage.setItem("SECSData", JSON.stringify(data));
        },
        loadData() {
            var data = JSON.parse(localStorage.getItem("SECSData"));

            this.workers = data.mines;
        }
    }
})