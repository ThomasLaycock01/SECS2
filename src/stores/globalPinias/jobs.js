import {defineStore} from "pinia";

import { useMinesStore } from "../mines";
import { useForgeStore } from "../forge";
import { useMetalmancerStore } from "../metalmancer";

export const useJobsStore = defineStore("jobs", {
    state: () => {
        return {
            childPinias: {
                mines: {id: "mines", jobs: ["mineWorker", "mineOverseer"], piniaObject() {const mines = useMinesStore(); return mines;}},
                forge: {id: "forge", jobs: ["smelter", "smith"], piniaObject() {const forge = useForgeStore(); return forge;}},
                metalmancer: {id: "metalmancer", jobs: ["metalmancer"], piniaObject() {const metalmancer = useMetalmancerStore(); return metalmancer;}}
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