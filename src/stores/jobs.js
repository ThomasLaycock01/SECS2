import {defineStore} from "pinia";

import { useCultistsStore } from "./cultists";
import { useBuildingsStore } from "./buildings";
import { useExpansionsStore } from "./expansions";



export const useJobsStore = defineStore("jobs", {
    state: () => {
        return {
            Gold: {miner: {id: "miner", output: 1, limitingBuilding: "goldMine", name:"Gold Miner", array: [], stat: "str", reqExpansion: "mines", tier: "tier1"}, alchemist: {id: "alchemist", output: 1, limitingBuilding: "transmuter", name: "Alchemist", array: [], stat: "int", reqExpansion: "laboratory", tier: "tier1"}},
            Crystals: {miner: {id: "miner", output: 1, limitingBuilding: "crystalMine", name: "Crystal Miner", array: [], stat: "str", reqExpansion: "mines", tier: "tier1"}}
        }
    },
    getters: {
        getAll(state) {
            return state;
        },
        getByProdType(state) {
            return (prodType) => state[prodType];
        },
        getAssociatedStat(state) {
            return (resource, job) => state[resource][job]["stat"];
        },
        getArray(state) {
            return (resource, job) => state[resource][job]["array"];
        },
        getOutput(state) {
            return (resource, job) => state[resource][job]["output"];
        },
        getName(state) {
            return (resource, job) => state[resource][job]["name"];
        },
        getReqExpansion(state) {
            return (resource, job) => state[resource][job]["reqExpansion"];
        },
        getTier(state) {
            return (resource, job) => state[resource][job]["tier"];
        }
    },
    actions: {
        addCultistToJobArray(cultistId, prodType, job) {
            const cultists = useCultistsStore();
            const cultist = cultists.getCultistById(cultistId);
            this[prodType][job].array.push(cultist);
        },
        checkIfAtLimit(resource, job) {
            const buildings = useBuildingsStore();

            const buildingId = this[resource][job]["limitingBuilding"];

            const limit = buildings.getBuildingOwnedById(buildingId);

            const array = this[resource][job]["array"];

            if(array.length == limit) {
                return true;
            }
            else {
                return false;
            }
        },
        removeCultistfromJob(cultistId) {
            //doing it like this just cause a cultist can only have 1 job, so just make sure it's not in any of the arrays
            for (var i in this) {
                for (var j in this[i]) {
                    if (this[i][j]["array"]) {
                        const newArray = this[i][j]["array"].filter((cultist) => cultist.getId() != cultistId);
                        this[i][j]["array"] = newArray;
                    }
                }
            }
        },
        checkIfHasReqExapansion(expansion, tier) {
            const expansions = useExpansionsStore();

            //const expansion = this.getReqExpansion(prodType, jobId);
            //const tier = this.getTier(prodType, jobId);

            return expansions.checkIfBuilt(expansion, tier);

        }
    }
});