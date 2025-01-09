import { defineStore } from "pinia";

export const usePartiesStore = defineStore("parties", {
    state: () => {
        return {
            parties: []
        }
    },
    getters: {
        getParties(state) {
            return state.parties;
        }
    },
    actions: {
        generatePartyId() {
            var id = 0;

            const idArray = [];

            for (var i in parties) {
                idArray.push(parties[i].getId());
            }

            while (idArray.includes(id)) {
                id++;
            }

            return id;
        }
    }
})