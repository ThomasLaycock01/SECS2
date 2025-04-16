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
                },
                partySelect: {
                    isActive: false,
                    areaObj: null
                },
                equipment: {
                    isActive: false,
                    cultist: null,
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
        },
        getPartySelectAreaObj(state) {
            return state.modals.partySelect.areaObj;
        },
        getEquipmentCultist(state) {
            return state.modals.equipment.cultist;
        },
        getEquipmentType(state) {
            return state.modals.equipment.type;
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
            else {
                //if cultists were added, but its not being saved, make sure those cultists dont have a party assigned
                partyObj.removeCultistsForNoSave();
            }

            this.toggleModal("party");
        },
        openPartySelect(area) {
            this.modals.partySelect.areaObj = area;

            this.toggleModal("partySelect");
        },
        closePartySelect() {
            this.toggleModal("partySelect");
        },
        openEquipment(cultist) {
            this.modals.equipment.cultist = cultist;

            this.toggleModal("equipment");
        },
        closeEquipment() {
            this.modals.equipment.cultist = null;

            this.toggleModal("equipment");
        }
    }
})