import {defineStore} from "pinia";

import { useResourcesStore } from "./resources";
import { useBuildingsStore } from "./buildings";

import { deserializeCultist } from "@/functions";

export const useCultistsStore = defineStore("cultists", {
    state: () => {
        return {
            regular: [], 
            special: [],
            misc : {
                cultistLimit: 2,
                summoning: 0
            }
        }
    },
    getters: {
        numOfCultists(state) {
            return state.regular.length + state.misc.summoning;
        },
        regularCultists(state) {
            return state.regular;
        },
        getCultistById: (state) => {
            return (cultistId) => state.regular.find((cultist) => cultist.getId() == cultistId);
        },
        getUnemployed(state) {
            return state.regular.filter((cultist) => cultist.getJob() == null);
        },
        getEmployed(state) {
            return state.regular.filter((cultist) => cultist.getJob() != null);
        },
        getCultistLimit(state) {
            return state.misc.cultistLimit;
        }
    },
    actions: {
        tick() {
            const resources = useResourcesStore();
            //calculating evilness
            var evilnessOutput = 0;
            for (var i in this.regularCultists) {
                evilnessOutput += 1 * (1 + this.regularCultists[i].getGlobalModifiers("evilness"));
            }

            resources.setResourcePerSec("evilness", evilnessOutput);
            resources.updateResourceOnTick("evilness");

        },
        addCultist(cultist) {
            this.regular.push(cultist);
        },
        removeCultist(cultistId) {
            this.regular = this.regular.filter((cultist) => cultist.getId() != cultistId)
        },
        checkUnemployed() {
            const array = this.regular;
            const unEmployedArray = array.filter((obj) => obj.getJob() == null);
            if (unEmployedArray.length == 0) {
                return false;
            }
            else {
                return true;
            }
        },
        checkIfIdUsed(id) {
            for (var i in this.regular) {
                if (this.regular[i].getId() == id) {
                    return true;
                }
            }

            return false;
        },
        calculateCultistLimit() {
            const buildings = useBuildingsStore();

            const buildingLimit = buildings.getTotalBuildingModifier("cultistLimit");

            this.misc.cultistLimit = 2 + buildingLimit;
        },
        checkCultistSpace() {
            return !(this.numOfCultists == this.getCultistLimit);
        },
        //summoning
        addSummoning() {
            this.summoning++;
        },
        removeSummoning() {
            this.summoning--;
        }
        /*,
        saveData() {
            var data = JSON.parse(localStorage.getItem("SECSData"));

            const cultistObject = {}

            //serializing cultists to store them
            for (var i in this["regular"]) {
                const cultist = this["regular"][i];
                cultistObject[cultist.getId()] = cultist.serialize();
            }

            data.cultists = cultistObject;

            localStorage.setItem("SECSData", JSON.stringify(data));
        },
        loadData() {
            var data = JSON.parse(localStorage.getItem("SECSData"));

            for (var i in data.cultists) {
                const cultistObject = data.cultists[i];

                deserializeCultist(cultistObject);
            }
        }*/
    }
});