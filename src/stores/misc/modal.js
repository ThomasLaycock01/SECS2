import { defineStore } from "pinia";

import { usePartiesStore } from "../barracks/parties";

export const useModalsStore = defineStore("modals", {
    state: () => {
        return {
            modals: {
                cultist: {
                    isActive: false,
                    cultist: null
                },
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
        getCultistCultist(state) {
            return state.modals.cultist.cultist;
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
        openCultist(cultistObj) {
            this.modals.cultist.cultist = cultistObj;
            this.toggleModal("cultist");
        },
        closeCultist() {
            this.toggleModal('cultist');
            this.modals.cultist.cultist = null;
        },
        openAssignment(pinia, job) {
            this.modals.assignment.activePinia = pinia;
            this.modals.assignment.activeJob = job;
            this.toggleModal('assignment');
        },
        closeAssignment() {
            this.toggleModal('assignment');
            this.modals.assignment.activePinia = null;
            this.modals.assignment.activeJob = null;
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
            this.modals.party.partyObj = null;
        },
        openPartySelect(area) {
            this.modals.partySelect.areaObj = area;

            this.toggleModal("partySelect");
        },
        closePartySelect() {
            this.toggleModal("partySelect");

            this.modals.partySelect.areaObj = null;
        },
        openEquipment(cultist) {
            this.modals.equipment.cultist = cultist;

            this.toggleModal("equipment");
        },
        closeEquipment() {
            this.toggleModal("equipment");

            this.modals.equipment.cultist = null;
        }
    }
})