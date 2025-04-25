import { defineStore } from "pinia";

import { useCultistsStore } from "../globalPinias/cultists";

export const useTooltipsStore = defineStore('tooltips', {
    state: () => {
        return {
            currentlyShowing: false,
            currentPos: {
                top: null,
                left: null
            }
        }
    },
    getters: {
        getCurrentlyShowing(state) {
            return state.currentlyShowing;
        },
        getCurrentPos(state) {
            return state.currentPos;
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
        },
        getInstaHealTooltip() {
            return (partyOrCultistObj) => {
                if (partyOrCultistObj.getGrainHealCost() > 0) {
                    const returnObj = {
                        name: "Insta-Heal",
                        desc: "Spend grain to instantly heal a cultist",
                        costs() {
                            return { grain: partyOrCultistObj.getGrainHealCost() };
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
        getAutoHealTooltip() {
            return (partyObj) => {
                const returnObj = {
                    name: "Automatic Insta-Heal",
                    desc: "Cultists that run out of health will automatically Insta-heal, if you can afford it.",
                    effectDesc: partyObj.getAutoHeal() ? "Enabled" : "Disabled"
                }
                return returnObj;
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
                    tier: itemObj.getTier(),
                    desc: itemObj.getEffectDesc(),
                    effectDesc: itemObj.getEquippedCultist() ? `Equipped by ${itemObj.getEquippedCultist().getName()}` : "Not currently equipped"
                }
                return returnObj;
            }
        },
        getRaceTooltip() {
            return (raceId) => {
                const cultists = useCultistsStore();

                const tooltipObj = cultists.getRaceTooltipObj(raceId);

                const returnObj = {
                    desc: tooltipObj.desc,
                    effectDesc: tooltipObj.effectDesc
                }

                return returnObj;
            }
        }
    },
    actions: {
        showTooltip(t, l) {
            this.currentPos = {
                top: t,
                left: l
            }

            this.currentlyShowing = true;
        },
        hideTooltip() {
            this.currentPos = {
                top: null,
                left: null
            }

            this.currentlyShowing =false;
        }
    }
})