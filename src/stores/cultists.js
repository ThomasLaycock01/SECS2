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
            return (cultistId) => state.regular.find((cultist) => cultist.id == cultistId);
        }
    },
    actions: {
        addCultist(cultist) {
            this.regular.push(cultist);
        }
    }
});