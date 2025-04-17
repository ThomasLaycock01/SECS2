import { defineStore } from "pinia";

import { Party } from "@/classes/Party";
import { Role } from "@/classes/Role";

import roles from "@/assets/json/roles.json";
import { useProgressionStore } from "../misc/progression";

export const usePartiesStore = defineStore("parties", {
    state: () => {
        return {
            parties: {},
            roles: {},
            unlockedRoles: ["explorer"]
        }
    },
    getters: {
        getParties(state) {
            return state.parties;
        },
        getNumOfParties(state) {
            return Object.keys(state.parties).length;
        },
        getUnlockedRoles(state) {
            const returnArray = [];

            for (var i in state.roles) {
                if (state.unlockedRoles.includes(state.roles[i].getId())) {
                    returnArray.push(state.roles[i]);
                }
            }

            return returnArray;
        }
    },
    actions: {
        tick() {
            //just used for parties that are healing
            for (var i in this.parties) {
                const party = this.parties[i];
                if (!party.getCurrentActivity()) {
                    party.healCultists();
                }
            }
        },
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

            return party;
        },
        saveParty(party) {
            const progression = useProgressionStore();

            //only parties with at least 1 cultist and role are saved
            if (party.getPartySize() > 0) {
                const id = party.getId();
                this.parties[id] = party;
            }

            //check for parties with no cultists and delete them
            for (var i in this.parties) {
                const party = this.parties[i];
                if (party.getPartySize() == 0) {
                    const id = party.getId();
                    delete this.parties[id];
                }
            }

            //update progression for firstParty check
            progression.updateProgression();
        },
        //roles
        instantiateRoles() {
            for (var i in roles) {
                const role = new Role(roles[i]);

                this.roles[role.getId()] = role;
            }
        },
        unlockRole(id) {
            this.unlockedRoles.push(id);
        }
    }
})