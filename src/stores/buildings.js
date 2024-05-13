import { defineStore } from "pinia";

export const useBuildingsStore = defineStore("buildings", {
    state: () => {
        return {buildings: [{id: "goldMine", owned: 0, costs: {Gold: 20}, prodType: "Gold", jobId: "miner"}, 
        {id:"crystalMine", owned: 0, costs: {Gold: 50}, prodType: "Crystals", jobId: "miner"},
        {id:"transmuter", owned: 0, costs: {Gold: 50}, prodType: "Gold", jobId: "alchemist"}]}
    },
    getters: {
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
        }
    }
})