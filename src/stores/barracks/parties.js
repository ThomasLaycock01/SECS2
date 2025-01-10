import { defineStore } from "pinia";

import { Party } from "@/classes/Party";
import { Role } from "@/classes/Role";

import roles from "@/assets/json/roles.json";

export const usePartiesStore = defineStore("parties", {
    state: () => {
        return {
            parties: {},
            roles: {}
        }
    },
    getters: {
        getParties(state) {
            return state.parties;
        },
        getRoles(state) {
            return state.roles;
        }
    },
    actions: {
        //parties
        generatePartyId() {
            var id = 0;

            const idArray = [];

            for (var i in this.parties) {
                idArray.push(this.parties[i].getId());
            }

            while (idArray.includes(id)) {
                id++;
            }

            return id;
        },
        createNewParty() {
            const party = new Party(this.generatePartyId());
            party.initSlots();

            return party;
        },
        saveParty(party) {
            console.log(party);
            //only parties with at least 1 cultist are saved
            if (party.getPartyCultistCount() > 0) {
                const id = party.getId();
                this.parties[id] = party;
            }
        },
        //roles
        instantiateRoles() {
            for (var i in roles) {
                const role = new Role(roles[i]);

                this.roles[role.getId()] = role;
            }
        }
    }
})