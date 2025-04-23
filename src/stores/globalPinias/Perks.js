import { defineStore } from "pinia";

export const usePerkStore = defineStore('perks',{
    state: () => {
        return {
            perks: {
                //combat perks
                //generic ATK
                2001: {
                    id: 2001, 
                    name: "Strong I", 
                    modifiers: [
                        {
                            type: "atk", 
                            modifier() {
                                return 0.2;
                            }
                        }
                    ], 
                    level: 1, 
                    desc: "This Cultist is STRONG!", 
                    effectDesc: "+20% Atk"
                },
                2002: {
                    id: 2002, 
                    name: "Strong II", 
                    modifiers: [
                        {
                            type: "atk", 
                            modifier() {
                                return 0.2;
                            }
                        }
                    ], 
                    level: 1,
                    preqs: [2001], 
                    desc: "This Cultist is BUFF!", 
                    effectDesc: "+20% Atk"
                },
                2003: {
                    id: 2003, 
                    name: "Strong III", 
                    modifiers: [
                        {
                            type: "atk", 
                            modifier() {
                                return 0.2;
                            }
                        }
                    ], 
                    level: 7,
                    preqs: [2002], 
                    desc: "This Cultist is JACKED!", 
                    effectDesc: "+20% Atk"
                },
                2004: {
                    id: 2004, 
                    name: "Strong IV", 
                    modifiers: [
                        {
                            type: "atk", 
                            modifier() {
                                return 0.2;
                            }
                        }
                    ], 
                    level: 10,
                    preqs: [2003],  
                    desc: "This Cultist is RIPPED!", 
                    effectDesc: "+20% Atk"
                },
                //generic HP
                2005: {
                    id: 2005, 
                    name: "Tough I", 
                    modifiers: [
                        {
                            type: "HP", 
                            modifier() {
                                return 0.2;
                            }
                        }
                    ], 
                    level: 1, 
                    desc: "This Cultist is TOUGH!", 
                    effectDesc: "+20% HP"
                },
                2006: {
                    id: 2006, 
                    name: "Tough II", 
                    modifiers: [
                        {
                            type: "HP", 
                            modifier() {
                                return 0.2;
                            }
                        }
                    ], 
                    level: 4,
                    preqs: [2005], 
                    desc: "This Cultist is BEEFY!", 
                    effectDesc: "+20% HP"
                },
                2007: {
                    id: 2007, 
                    name: "Tough III", 
                    modifiers: [
                        {
                            type: "HP", 
                            modifier() {
                                return 0.2;
                            }
                        }
                    ], 
                    level: 7,
                    preqs: [2006], 
                    desc: "This Cultist is RESILIENT!", 
                    effectDesc: "+20% HP"
                },
                2008: {
                    id: 2008, 
                    name: "Tough IV", 
                    modifiers: [
                        {
                            type: "HP", 
                            modifier() {
                                return 0.2;
                            }
                        }
                    ], 
                    level: 10,
                    preqs: [2007], 
                    desc: "This Cultist is RUGGED!", 
                    effectDesc: "+20% HP"
                },
                //exchange perks
                2009: {
                    id: 2009, 
                    name: "Headstrong", 
                    modifiers: [
                        {
                            type: "pAtk", 
                            modifier() {
                                return 0.25;
                            }
                        },
                        {
                            type: "def",
                            modifier() {
                                return -0.1;
                            }
                        }
                    ], 
                    level: 3,
                    preqs: [2001], 
                    desc: "There is a fine line between bravery and recklessness.", 
                    effectDesc: "+25% Physical Atk, but -10% Def"
                },
                2010: {
                    id: 2010, 
                    name: "Shield-Bearer", 
                    modifiers: [
                        {
                            type: "pDef", 
                            modifier() {
                                return 0.25;
                            }
                        },
                        {
                            type: "mDef",
                            base() {
                                return 1;
                            }
                        },
                        {
                            type: "atk",
                            modifier() {
                                return -0.3;
                            }
                        }
                    ], 
                    level: 3,
                    preqs: [2005], 
                    desc: "This Cultist traded their standard-issue weapon for another shield.", 
                    effectDesc: "+25% Physical Def, +1 base Magic Def, but -30% Atk"
                }
            }
        }
    },
    getters: {
        getAll(state) {
            return state.perks;
        },
        perkCheck(state) {
            return (perkId, cultist) => {
                const perkObj = state.perks[perkId];
                
                if (perkObj.level > cultist.getLevel()) {
                    return false;
                }
            
                if (cultist.checkIfHasPerk(perkObj.id)) {
                    return false;
                }
            
                if (perkObj.preqs) {
                    for (var i in perkObj.preqs) {
                        if (!cultist.checkIfHasPerk(perkObj.preqs[i])) {
                            return false;
                        }
                    }
                }
            
                return true;
            }
        },
        getAvailable(state) {
            return (cultist) => {
                const returnArray = [];

                for (var i in state.perks) {
                    if (state.perkCheck(state.perks[i].id, cultist)) {
                        returnArray.push(state.perks[i]);
                    }
                }

                return returnArray;
            }
        }
    },
    actions: {

    }
})