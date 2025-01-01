import { defineStore } from "pinia";

export const useModalsStore = defineStore("modals", {
    state: () => {
        return {
            modals: {
                assignment: false
            }
        }
    },
    getters: {
        checkModal(state) {
            return (modal) => state.modals[modal];
        }
    },
    actions: {
        toggleModal(modal) {
            if (this.modals[modal]) {
                this.modals[modal] = false;
            }
            else {
                this.modals[modal] = true;
            }
        }
    }
})