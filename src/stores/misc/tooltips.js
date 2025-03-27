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

                console.log(returnArray);
                return returnArray;
            }
        },
        getInstaHealTooltip() {
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
        },
        getAutoEmbarkTooltip() {
            return (enabled) => {
                const returnObj = {
                    name: "Auto-Embark",
                    desc: "Automatically Embark when all cultists in the assigned party are at full health",
                    effectDesc: `Currently ${enabled ? "Enabled" : "Disabled"}`
                }
                return returnObj;
            }
        },
        getItemTooltip() {
            return (itemObj) => {
                const returnObj = {
                    name: itemObj.getName(),
                    desc: itemObj.getEffectDesc(),
                    effectDesc: itemObj.getEquippedCultist() ? `Equipped by ${itemObj.getEquippedCultist().getName()}` : "Not currently equipped"
                }
                return returnObj;
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