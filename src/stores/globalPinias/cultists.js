import {defineStore} from "pinia";

import { useResourcesStore } from "./resources";
import { useBuildingsStore } from "./buildings";
import { useProgressionStore } from "../misc/progression";

import races from "@/assets/json/races.json";

export const useCultistsStore = defineStore("cultists", {
    state: () => {
        return {
            regular: [],
            special: [],
            races: {},
            misc : {
                regularLimit: 2,
                defaultLevelLimit: 10
            }
        }
    },
    getters: {
        getNumOfCultists(state) {
            return state.regular.length;
        },
        getCultists(state) {
            return state.regular;
        },
        getSummonedCultists(state) {
            return state.summoned;
        },
        getCultistById: (state) => {
            return (cultistId) => {
                return state.regular.find(cultist => cultist.getId() == cultistId);
            }
        },
        getCultistsByRacialGroup(state) {
            return (racialGroup) => {
                var returnArray = [];
                for (var i in state.regular) {
                    if (state.regular[i].getRacialGroup() == racialGroup) {
                        returnArray.push(state.regular[i]);
                    }
                }
                return returnArray;
            }
        },
        getUnemployed(state) {
            return state.regular.filter((cultist) => cultist.getJob() == null);
        },
        checkUnemployed(state) {
            return state.getUnemployed.length > 0;
        },
        getEmployed(state) {
            return state.getCultists.filter((cultist) => cultist.getJob() != null);
        },
        //misc
        getCultistLimit(state) {
            return state.misc.regularLimit;
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
            //calculating evilness
            var evilnessOutput = 0;
            for (var i in this.getCultists) {
                evilnessOutput += 1 * (1 + this.getCultists[i].getModifiers("evilness", null, 0.1));
            }

            resources.setResourcePerSec("evilness", evilnessOutput);
            //no need to call updateResources - its called elsewhere
            //WRONG, BITCH!!!!
            resources.updateResources();

            //ticking down knocked out cultists
            for (var i in this.getCultists) {
                const cultist = this.getCultists[i];
                if (cultist.getKnockedOut()) {
                    cultist.decrementKnockOutTime();
                }
            }
        },
        addCultist(cultist) {
            const progression = useProgressionStore();

            this.regular.push(cultist);

            progression.updateProgression();
        },
        removeCultist(cultistId) {
            this.regular = this.regular.filter((cultist) => cultist.getId() != cultistId)
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
            return !(this.getNumOfCultists == this.getCultistLimit);
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