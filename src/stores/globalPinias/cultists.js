import {defineStore} from "pinia";

import { useResourcesStore } from "./resources";
import { useBuildingsStore } from "./buildings";
import { useProgressionStore } from "../misc/progression";

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
        getCultistsByRacialGroup(state) {
            return (racialGroup) => {
                var returnArray = [];
                for (var i in state.getAllNonSpecial) {
                    if (state.getAllNonSpecial[i].getRacialGroup() == racialGroup) {
                        returnArray.push(state.getAllNonSpecial[i]);
                    }
                }
                return returnArray;
            }
        },
        getUnemployed(state) {
            return state.regular.filter((cultist) => cultist.getJob() == null).concat(state.summoned.filter((cultist) => cultist.getJob() == null && cultist.getMisc("toDissassemble") == false));
        },
        checkUnemployed(state) {
            return state.getUnemployed.length > 0;
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
            for (var i in this.getRegularCultists) {
                evilnessOutput += 1 * (1 + this.getRegularCultists[i].getModifiers("evilness", null, 0.1)); //+ buildings.getBuildingModifier("evilness"));
            }

            resources.setResourcePerSec("evilness", evilnessOutput);
            //no need to call updateResources - its called elsewhere
            //WRONG, BITCH!!!!
            resources.updateResources();

            //ticking down knocked out cultists
            for (var i in this.getRegularCultists) {
                const cultist = this.getRegularCultists[i];
                if (cultist.getKnockedOut()) {
                    cultist.decrementKnockOutTime();
                }
            }
        },
        addCultist(cultist) {
            const progression = useProgressionStore();

            if (cultist.getType() == "summon") {
                this.summoned.push(cultist);
            }
            else {
                this.regular.push(cultist);
            }

            progression.updateProgression();
        },
        removeRegularCultist(cultistId) {
            this.regular = this.regular.filter((cultist) => cultist.getId() != cultistId)
        },
        removeSummonedCultist(cultistId) {
            console.log(cultistId)
            this.summoned = this.summoned.filter((cultist) => cultist.getId() != cultistId);
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
            var totalLimit = 2;

            const buildings = useBuildingsStore();

            const buildingModifiers = buildings.getBuildingModifier("regularLimit");

            for (var i in buildingModifiers) {
                totalLimit += buildingModifiers[i].modifier;
            }

            this.misc.regularLimit = totalLimit;
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