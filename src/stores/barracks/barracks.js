import { defineStore } from "pinia";


export const useBarracksStore = defineStore("barracks", {
    state: () => {
        return {
            party: {

            },
            misc: {
                partyLimit: 3
            }
        }
    },
    getters: {
        getParty(state) {
            return state.party;
        },
        getPartySize(state) {
            return Object.keys(state.party).length;
        },
        //misc
        getPartyLimit(state) {
            return state.misc.partyLimit;
        },
        checkIfPartySpace(state) {
            return state.getPartySize < state.getPartyLimit;
        }
    },
    actions: {
        tick() {

        },
        onBuild() {
            
        },
        //party
        addRole(role) {
            const index = this.getPartyIndex();

            const obj = {
                index: index,
                role: role,
                cultist: null
            };

            this.party[index] = obj;
        },
        getPartyIndex() {
            var index = 0;
            const indexArray = [];

            for (var i in this.getParty) {
                indexArray.push(this.getParty[i].index);
            }

            while (indexArray.includes(index)) {
                index++;
            }

            return index;
        }
    }
})