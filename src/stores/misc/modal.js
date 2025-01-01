import { defineStore } from "pinia";

export const useModalsStore = defineStore("modals", {
    state: () => {
        return {
            modals: {
                assignment: {
                    isActive: false,
                    activePinia: null,
                    activeJob: null
                }
            }
        }
    },
    getters: {
        checkModal(state) {
            return (modal) => state.modals[modal].isActive;
        },
        getAssignmentPinia(state) {
            return state.modals.assignment.activePinia;
        },
        getAssignmentJob(state) {
            return state.modals.assignment.activeJob;
        }
    },
    actions: {
        toggleModal(modal) {
            if (this.modals[modal].isActive) {
                this.modals[modal].isActive = false;
            }
            else {
                this.modals[modal].isActive = true;
            }
        },
        openAssignment(pinia, job) {
            this.modals.assignment.activePinia = pinia;
            this.modals.assignment.activeJob = job;
            this.toggleModal('assignment');
        },
        closeAssignment() {
            this.modals.assignment.activePinia = null;
            this.modals.assignment.activeJob = null;
            this.toggleModal('assignment');
        }
    }
})