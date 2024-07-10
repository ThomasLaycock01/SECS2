import { defineStore } from "pinia";

import { useResourcesStore } from "./resources";

export const useBuildingsStore = defineStore("buildings", {
    state: () => {
        return {buildings: [
        //mines buildings
        {id: "goldMine", owned: 0, costs: {Gold: 20}},
        {id:"crystalMine", owned: 0, costs: {Gold: 50}},
        //laboratory buildings
        {id:"transmuter", owned: 0, costs: {Gold: 50}},
        //barracks buildings
        {id:"drillSquare", owned: 0, costs: {Gold: 2000, Crystals: 1000}},
        //tower buildings
        {id:"infuser", owned: 0, costs: {Gold: 5000, Crystals: 200}},
        //academy buidlings
        {id:"lectureHall", owned: 0, costs: {Gold: 10000, Crystals: 20000,}},
        //dungeons buildings
        {id:"cell", owned: 0, costs: {Gold: 100000}}]}
    },
    getters: {
        getNumOfBuildingById(state) {
            return (buildingId) => state.buildings.find((building) => building.id == buildingId).owned;
        },
        getBuildingById: (state) => {
            return (buildingId) => state.buildings.find((building) => building.id == buildingId);
        },
        getBuildingCostsById: (state) => {
            return (buildingId) => state.buildings.find((building) => building.id == buildingId).costs;
        },
        getBuildingOwnedById: (state) => {
            return (buildingId) => state.buildings.find((building) => building.id == buildingId).owned;
        },
        getAll(state) {
            return state.buildings;
        }
    },
    actions: {
        buildingBuilding(buildingId) {
            this.buildings.find((building) => building.id == buildingId).owned += 1;
        },
        checkIfCanAfford(buildingId) {
            const resources = useResourcesStore();

            const chosenBuilding = this.buildings.filter(obj =>  obj.id == buildingId)[0]

            var canAfford = true;

            for (var i in chosenBuilding.costs) {
                if (resources.getResourceTotal(i) < chosenBuilding.costs[i]) {
                    canAfford = false;
                }
            }

            return canAfford;
        }
    }
})