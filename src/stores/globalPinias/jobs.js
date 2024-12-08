import {defineStore} from "pinia";

import { useMinesStore } from "../mines/mines";
import { useForgeStore } from "../mines/forge";
import { useMetalmancerStore } from "../mines/metalmancer";
import { useWarformerStore } from "../mines/warformer";

export const useJobsStore = defineStore("jobs", {
    state: () => {
        return {
            childPinias: {
                mines: {id: "mines", jobs: ["mineWorker", "mineOverseer"], piniaObject() {const mines = useMinesStore(); return mines;}},
                forge: {id: "forge", jobs: ["smelter", "smith"], piniaObject() {const forge = useForgeStore(); return forge;}},
                metalmancer: {id: "metalmancer", jobs: ["metalmancer"], piniaObject() {const metalmancer = useMetalmancerStore(); return metalmancer;}},
                warformer: {id: "warformer", jobs: ["warformer"], piniaObject() {const warformer = useWarformerStore(); return warformer;}}
            }
        }
    },
    getters: {
        getProdModifier(state) {
            return (jobId) => {
                for (var i in state.childPinias) {
                    if (state.childPinias[i].jobs.includes(jobId)) {
                        const pinia = state.childPinias[i].piniaObject();
                        return pinia.getJobModifier(jobId);
                    }
                }
            }
        }
    },
    actions: {
    }
});