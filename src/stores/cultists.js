import {defineStore} from "pinia";

export const useCultistsStore = defineStore("cultists", {
    state: () => {
        return {regular: [], special: []}
    },
    getters: {
        numOfCultists(state) {
            return state.regular.length;
        },
        regularCultists(state) {
            return state.regular;
        },
        getCultistById: (state) => {
            return (cultistId) => state.regular.find((cultist) => cultist.getId() == cultistId);
        },
        getUnemployed(state) {
            return state.regular.filter((cultist) => cultist.getJob() == null);
        },
        getEmployed(state) {
            return state.regular.filter((cultist) => cultist.getJob() != null);
        },
        getFreeSkillPoints(state) {
            return state.regular.filter((cultist) => cultist.getFreeStatPoints() != 0).length >= 1 ? true : false;
        }
    },
    actions: {
        addCultist(cultist) {
            this.regular.push(cultist);
        },
        removeCultist(cultistId) {
            this.regular = this.regular.filter((cultist) => cultist.getId() != cultistId)
        },
        checkUnemployed() {
            const array = this.regular;
            const unEmployedArray = array.filter((obj) => obj.getJob() == null);
            if (unEmployedArray.length == 0) {
                return false;
            }
            else {
                return true;
            }
        },
        checkIfIdUsed(id) {
            var idUsed = false;

            for (var i in this.regular) {
                if (this.regular[i].getId() == id) {
                    idUsed = true;
                }
            }

            return idUsed;
        }
    }
});