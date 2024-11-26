import { defineStore } from "pinia"

import { useCultistsStore } from "./globalPinias/cultists";
import { useInventoryStore } from "./globalPinias/inventory";

import items from "../assets/json/items.json";

export const useGolemDissassemblerStore = defineStore("golemDissassembler", {
    state: () => {
        return {
            actions: {

            },
            jobs: {
                dissassembler: {
                    id: "dissassembler",
                    cultistArray: [],
                    name: "Golem Dissassembler",
                    xpOutput: 2,
                    limit: 1
                }
            },
            queues: {
                dissassembly: []
            },
            items: {

            },
            misc: {
               currentDissassemblyProgress: 0
            }
        }
    },
    getters: {
         //actions
         getActions(state) {
            return state.actions;
        },
        //jobs
        getJobObject(state) {
            return (jobId) => {
                return state.jobs[jobId];
            }
        },
        getJobName(state) {
            return (jobId) => {
                return state.jobs[jobId].name;
            }
        },
        getJobArray(state) {
            return (jobId) => {
                return state.jobs[jobId].cultistArray;
            }
        },
        getXpAmount(state) {
            return (jobId) => {
                return state.jobs[jobId].xpOutput;
            }
        },
        getJobLimit(state) {
            return (jobId) => {
                return state.jobs[jobId].limit;
            }
        },
        checkIfJobHasSpace(state) {
            return (jobId) => {
                return state.jobs[jobId].cultistArray.length < state.jobs[jobId].limit;
            }
        },
        getJobModifier(state) {
            return (jobId) => {
                if (state.jobs[jobId].cultistArray.length == 0) {
                    return 0;
                }

                const cultists = useCultistsStore();

                var totalMod = 0;

                for (var i in state.jobs[jobId].cultistArray) {
                    const cultist = cultists.getCultistById(state.jobs[jobId].cultistArray[i]);
                    totalMod += cultist.getModifiers(jobId, null, 0.1)
                }

                return totalMod;
            }
        },
        //queues
        getDissassemblyQueue(state) {
            return state.queues.dissassembly;
        },
        getCurrentDissassembly(state) {
            return state.queues.dissassembly[0];
        },
        getCurrentDissassemblyPercentage() {
            return this.getCurrentDissassemblyProgress / 1000 * 100;
        },
        //items
        getItemById(state) {
            return (itemId) => {
                return state.items[itemId];
            }
        },
        //misc
        getCurrentDissassemblyProgress(state) {
            return state.misc.currentDissassemblyProgress;
        }
    },
    actions: {
        tick() {
            const cultists = useCultistsStore();

            if (this.getCurrentDissassembly) {
                this.misc.currentDissassemblyProgress += 100;

                if (this.getCurrentDissassemblyProgress >= 1000) {
                    this.misc.currentDissassemblyProgress -= 1000;

                    this.endDissassembly()
                }

                /*for (var i in this.getMetalmancerArray) {
                    const cultist = cultists.getCultistById(this.getMetalmancerArray[i]);
                    cultist.addXp(this.getXpAmount("metalmancer"));
                }*/
            }
        },
        onBuild() {
            this.instantiateItems();
        },
         //jobs
         addToJob(jobId, cultistId = null, obj = null) {
            const job = this.getJobObject(jobId);

            if (job.isUnique) {
                this.jobs[jobId].cultistId = cultistId;
            }
            else if (cultistId != null) {
                this.jobs[jobId].cultistArray.push(cultistId);
            }
            else {
                this.jobs[jobId].cultistArray.push(obj);
            }
        },
        removeFromJob(jobId, cultistId = null) {
            console.log(jobId);
            console.log(cultistId);
            if (cultistId === null) {
                const cultists = useCultistsStore();
                const cultist = cultists.getCultistById(this.jobs[jobId].cultistId);
                cultist.removeJob();
                this.jobs[jobId].cultistId = null;
            }
            else {
                this.jobs[jobId].cultistArray = this.jobs[jobId].cultistArray.filter(val => val != cultistId);
            }
        },
        /*
        getMetalmancerModifier() {
            const cultists = useCultistsStore();

            if (this.getMetalmancerArray.length == 0) {
                return 0;
            }

            var totalMod = 1;

            for (var i in this.getMetalmancerArray) {
                const cultist = cultists.getCultistById(this.getMetalmancerArray[i]);
                totalMod += cultist.getModifiers("metalmancer", null, 0.1)
            }

            return totalMod;
        },*/
        getGolemsAvailable() {
            const cultists = useCultistsStore();
            const golemArray = cultists.getCultistsByRacialGroup("golem");

            var returnArray = [];

            for (var i in golemArray) {
                if (!golemArray[i].getJob() && !golemArray[i].getMisc("toDissassemble")) {
                    returnArray.push(golemArray[i]);
                }
            }

            return returnArray;
        },
        addDissassembly(dissassemblyObject) {
            this.queues.dissassembly.push(dissassemblyObject);
        },
        endDissassembly() {
            const cultists = useCultistsStore();
            const inventory = useInventoryStore();

            cultists.removeSummonedCultist(this.queues.dissassembly[0].golem);

            switch (this.queues.dissassembly[0].part) {
                case "arm":
                    inventory.addItem(this.getItemById(3000));
                    break;
                case "chassis":
                    inventory.addItem(this.getItemById(3001));
                    break;
                case "heart":
                    inventory.addItem(this.getItemById(3002));
                    break;
                default:
                    console.log("Error - no part specified in golem dissassembly");
            }

            this.queues.dissassembly.shift();
        },
        //items
        instantiateItems() {
            this.items = items.golemDissassembler;
        }
    }
})