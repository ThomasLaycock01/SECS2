import { defineStore } from "pinia";

import { Party } from "@/classes/Party";
import { Role } from "@/classes/Role";

import roles from "@/assets/json/roles.json";
import { useProgressionStore } from "../misc/progression";

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
        getNumOfParties(state) {
            return Object.keys(state.parties).length;
        },
        getRoles(state) {
            return state.roles;
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
            party.initSlots();

            return party;
        },
        saveParty(party) {
            const progression = useProgressionStore();

            party.removeNoRoleCultists();
            //only parties with at least 1 cultist and role are saved
            if (party.getPartyCultistCount() > 0) {
                const id = party.getId();
                this.parties[id] = party;
            }

            //check for parties with no cultists and delete them
            for (var i in this.parties) {
                const party = this.parties[i];
                if (party.getPartyCultistCount() == 0) {
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
        }
    }
})