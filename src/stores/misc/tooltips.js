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
        },
        getInstaHealTooltip(state) {
            return (partyObj) => {
                if (partyObj.getGrainHealCost() > 0) {
                    const returnObj = {
                        name: "Insta-Heal",
                        desc: "Spend grain to instantly heal a cultist",
                        costs() {
                            return { grain: partyObj.getGrainHealCost() };
                        }
                    }
                    return returnObj;
                }
                else {
                    const returnObj = {
                        name: "Insta-Heal",
                        desc: "Spend grain to instantly heal a cultist",
                        effectDesc: "Already at full health!"
                    }
                    return returnObj;
                }   
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