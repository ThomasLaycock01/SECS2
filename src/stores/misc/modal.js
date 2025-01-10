import { defineStore } from "pinia";

import { usePartiesStore } from "../barracks/parties";

export const useModalsStore = defineStore("modals", {
    state: () => {
        return {
            modals: {
                assignment: {
                    isActive: false,
                    activePinia: null,
                    activeJob: null
                },
                party: {
                    isActive: false,
                    partyObj: null
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
        },
        getPartyObj(state) {
            return state.modals.party.partyObj;
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
        },
        openParty(partyObj = null) {
            const parties = usePartiesStore();

            console.log(partyObj);

            if (partyObj) {
                this.modals.party.partyObj = partyObj;
            }
            else {
                this.modals.party.partyObj = parties.createNewParty();
            }
            this.toggleModal("party");
        },
        closeParty(partyObj, save = true) {
            const parties = usePartiesStore();

            if (save) {
                parties.saveParty(partyObj);
            }

            this.toggleModal("party");
        }
    }
})