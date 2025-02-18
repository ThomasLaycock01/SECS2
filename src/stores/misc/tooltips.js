import { defineStore } from "pinia";


export const useTooltipsStore = defineStore('tooltips', {
    state: () => {
        return {
            activeTooltip: null
        }
    },
    getters: {
        getActiveTooltip(state) {
            return state.activeTooltip;
        },
        checkEmbarkWarning(state) {
            return (areaObj) => {
                var returnArray = [];

                if (!areaObj.getActiveParty()) {
                    returnArray.push("You need to assign a party!");
                }

                if (areaObj.getActiveParty() && areaObj.getActiveParty().getCurrentActivity()) {
                    returnArray.push("This party is currently busy!");
                }

                if (returnArray.length == 0) {
                    return false;
                }

                console.log(returnArray);
                return returnArray;
            }
        }
    },
    actions: {
        setActiveTooltip(id) {
            this.activeTooltip = id;
        },
        removeActiveTooltip() {
            this.activeTooltip = null;
        }
    }
})