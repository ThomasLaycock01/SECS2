import {defineStore} from "pinia";

import { useResourcesStore } from "./resources";
import { useBuildingsStore } from "./buildings";

import races from "@/assets/json/races.json";

export const useCultistsStore = defineStore("cultists", {
    state: () => {
        return {
            regular: [],
            summoned: [], 
            special: [],
            races: {},
            misc : {
                regularLimit: 2,
                summonLimit: 1,
                summoning: 0,
                defaultLevelLimit: 10
            }
        }
    },
    getters: {
        numOfCultists(state) {
            return state.regular.length + + state.summoned.length + state.misc.summoning;
        },
        getNumOfRegular(state) {
            return state.regular.length;
        },
        getNumOfSummoned(state) {
            return state.summoned.length + state.misc.summoning;
        },
        getAllNonSpecial(state) {
            return state.regular.concat(state.summoned);
        },
        getRegularCultists(state) {
            return state.regular;
        },
        getSummonedCultists(state) {
            return state.summoned;
        },
        getCultistById: (state) => {
            return (cultistId) => {
                if (state.regular.find((cultist) => cultist.getId() == cultistId)) {
                    return state.regular.find((cultist) => cultist.getId() == cultistId);
                }
                else {
                    return state.summoned.find((cultist) => cultist.getId() == cultistId);
                }
            }
        },
        getUnemployed(state) {
            return state.regular.filter((cultist) => cultist.getJob() == null).concat(state.summoned.filter((cultist) => cultist.getJob() == null));
        },
        getEmployed(state) {
            return state.getAllNonSpecial.filter((cultist) => cultist.getJob() != null);
        },
        //misc
        getRegularLimit(state) {
            return state.misc.regularLimit;
        },
        getSummonLimit(state) {
            return state.misc.summonLimit;
        },
        getSummoning(state) {
            return state.misc.summoning;
        },
        getDefaultLevelLimit(state) {
            return state.misc.defaultLevelLimit;
        },
        //races
        getRaceTemplate(state) {
            return (raceId) => {
                return state.races[raceId];
            }
        },
        getRaceCosts(state) {
            return (race) => {
                return state.races[race].costs;
            }
        },
        getRaceSummonCost(state) {
            return (race) => {
                return state.races[race].summonCost;
            }
        },
        checkIfHasRacialGroup(state) {
            return (racialGroup) => {
                for (var i in state.regular) {
                    if (state.regular[i].getRacialGroup() == racialGroup) {
                        return true;
                    }
                }

                return false;
            }
        }
    },
    actions: {
        tick() {
            const resources = useResourcesStore();
            const buildings = useBuildingsStore();
            //calculating evilness
            var evilnessOutput = 0;
            for (var i in this.regularCultists) {
                evilnessOutput += 1 * (1 + this.regularCultists[i].getModifiers("evilness", null, 0.1) + buildings.getBuildingModifier("evilness"));
            }

            resources.setResourcePerSec("evilness", evilnessOutput);
            resources.updateResources();
        },
        addCultist(cultist) {
            if (cultist.getType() == "summon") {
                this.summoned.push(cultist);
            }
            else {
                this.regular.push(cultist);
            }
        },
        removeCultist(cultistId) {
            this.regular = this.regular.filter((cultist) => cultist.getId() != cultistId)
        },
        checkUnemployed() {
            const unEmployedArray = this.regular.filter((obj) => obj.getJob() == null).concat(this.summoned.filter((obj) => obj.getJob() == null));
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
        calculateRegularLimit() {
            const buildings = useBuildingsStore();

            const buildingLimit = buildings.getBuildingModifier("regularLimit");

            this.misc.regularLimit = 2 + buildingLimit;
        },
        checkCultistSpace() {
            return !(this.numOfCultists == this.getRegularLimit);
        },
        checkRegularCultistSpace() {
            return !(this.getNumOfRegular == this.getRegularLimit);
        },
        checkSummonedCultistSpace() {
            return !(this.getNumOfSummoned == this.getSummonLimit);
        },
        //summoning
        addSummoning() {
            this.misc.summoning++;
        },
        removeSummoning() {
            this.misc.summoning--;
        },
        //races
        instantiateRaces() {
            this.races = races;
        },
        getRacesByRacialGroup(racialGroup) {
            const returnArray = [];
            for (var i in this.races) {
                if (this.races[i].racialGroup == racialGroup) {
                    returnArray.push(this.races[i]);
                }
            }
            return returnArray;
        }
    }
});