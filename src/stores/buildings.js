import { defineStore } from "pinia";

import { useResourcesStore } from "./resources";
import { useCostsStore } from "./costs";
import { useMiscStore } from "./misc";
import { useCultistsStore } from "./cultists";

export const useBuildingsStore = defineStore("buildings", {
    state: () => {
        return {buildings: {
            //mines buildings
            goldMine: {id: "goldMine", owned: 0, jobOnly: true},
            crystalMine: {id:"crystalMine", owned: 0, jobOnly: true},
            //laboratory buildings
            transmuter: {id:"transmuter", owned: 0, jobOnly: true},
            crystalliser: {id:"crystalliser", owned: 0, jobOnly: true},
            //barracks buildings
            drillSquare: {id:"drillSquare", owned: 0, jobOnly: true},
            bunkBeds: {id:"bunkBeds", owned: 0, jobOnly: false, special:"cultistLimit"},
            //tower buildings
            infuser: {id:"infuser", owned: 0, jobOnly: true},
            spellCircle: {id:"spellCircle", owned: 0, jobOnly: false, special: "spellcasting"},
            //academy buidlings
            lectureHall: {id:"lectureHall", owned: 0, jobOnly: true},
            library: {id:"library", owned: 0, jobOnly: false, special: "levelLimit"},
            //dungeons buildings
            cell: {id:"cell", owned: 0, jobOnly: false, special: "cultistLimit"},
            tortureChamber: {id: "tortureChamber", owned: 0, jobOnly: false, special: "EvilnessOutput"}
        }}
    },
    getters: {
        getNumOfBuildingById(state) {
            return (buildingId) => state.buildings[buildingId]["owned"];
        },
        getBuildingById: (state) => {
            return (buildingId) => state.buildings[buildingId];
        },
        getBuildingCostsById: (state) => {
            return (buildingId) => state.buildings[buildingId]["costs"];
        },
        getAll(state) {
            return state.buildings;
        }
    },
    actions: {
        buildingBuilding(buildingId) {
            this.buildings[buildingId].owned += 1;

            if (this.buildings[buildingId].special == "cultistLimit") {
                const misc = useMiscStore();
                misc.calculateCultistLimit();
            }
            else if (this.buildings[buildingId].special == "levelLimit") {
                const misc = useMiscStore();
                const cultists = useCultistsStore();
                misc.calculateLevelLimit();
                cultists.updateLevelLimits();
            }
        },
        getCultistLimitBuildings() {
            const returnArray = [];
            for (var i in this["buildings"]) {
                if (this["buildings"][i]["special"] == "cultistLimit") {
                    returnArray.push(this["buildings"][i])
                }
            }

            return returnArray;
        },
        getLevelLimitBuildings() {
            const returnArray = [];
            for (var i in this["buildings"]) {
                if (this["buildings"][i]["special"] == "levelLimit") {
                    returnArray.push(this["buildings"][i])
                }
            }

            return returnArray;
        },
        getEvilnessOutputBuildings() {
            const returnArray = [];
            for (var i in this["buildings"]) {
                if (this["buildings"][i]["special"] == "evilnessOutput") {
                    returnArray.push(this["buildings"][i])
                }
            }

            return returnArray;
        },
        checkIfCanAfford(buildingId) {
            const resources = useResourcesStore();
            const costs = useCostsStore();

            const cost = costs.getTotalBuildingCost(buildingId);

            var canAfford = true;

            for (var i in cost) {
                if (resources.getResourceTotal(i) < cost[i]) {
                    canAfford = false;
                }
            }

            return canAfford;
        },
        saveData() {
            var data = JSON.parse(localStorage.getItem("SECSData"));

            data.buildings = this["buildings"];

            localStorage.setItem("SECSData", JSON.stringify(data));
        },
        loadData() {
            var data = JSON.parse(localStorage.getItem("SECSData"));

            this["buildings"] = data.buildings;
        }
    }
})