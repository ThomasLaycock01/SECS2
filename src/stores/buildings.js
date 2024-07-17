import { defineStore } from "pinia";

import { useResourcesStore } from "./resources";
import { useCostsStore } from "./costs";

export const useBuildingsStore = defineStore("buildings", {
    state: () => {
        return {buildings: [
            //mines buildings
            {id: "goldMine", owned: 0},
            {id:"crystalMine", owned: 0},
            //laboratory buildings
            {id:"transmuter", owned: 0},
            //barracks buildings
            {id:"drillSquare", owned: 0},
            //tower buildings
            {id:"infuser", owned: 0},
            //academy buidlings
            {id:"lectureHall", owned: 0},
            //dungeons buildings
            {id:"cell", owned: 0}
        ]}
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
        }
    }
})