import { defineStore } from "pinia";

import { useCultistsStore } from "../globalPinias/cultists";

export const useTooltipsStore = defineStore('tooltips', {
    state: () => {
        return {
            currentlyShowing: false,
            currentPos: {
                top: null,
                left: null
            },
            currentData: null
        }
    },
    getters: {
        getCurrentlyShowing(state) {
            return state.currentlyShowing;
        },
        getCurrentPos(state) {
            return state.currentPos;
        },
        getCurrentData(state) {
            return state.currentData;
        },
        checkEmbarkWarning() {
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

                return returnArray;
            }
        },
        checkAssignWarning() {
            return(cultistObj) => {
                var returnArray = [];

                if (!cultistObj.getRole()) {
                    returnArray.push("This cultist does not have a role!");
                }

                if (returnArray.length == 0) {
                    return false;
                }

                return returnArray;
            }
        }
    },
    actions: {
        showTooltip(t, l, data) {
            this.currentPos = {
                top: t,
                left: l
            }

            this.currentData = data;

            this.currentlyShowing = true;
        },
        hideTooltip() {
            this.currentPos = {
                top: null,
                left: null
            }

            this.currentData = null;

            this.currentlyShowing =false;
        }
    }
})