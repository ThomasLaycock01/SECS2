import { defineStore } from "pinia";

import { useExpansionsStore } from "./expansions";
import { useCultistsStore } from "./globalPinias/cultists";

export const useMiscStore = defineStore("misc", {
    state: () => {
        return {
            firstLoad: true,
            seenConvos:[],
            defaultLevelLimit: 10
        }
    },
    getters: {
        /*getSeenConvos(state) {
            return state.seenConvos;
        },
        checkHasSeenConvo(state) {
            return (convoId) => state.seenConvos.includes(convoId);
        },*/
        getDefaultLevelLimit(state) {
            return state.defaultLevelLimit;
        }
    },
    actions: {/*,
        addSeenConvo(convoId) {
            this.seenConvos.push(convoId);
        },
        setFirstLoadFalse() {
            this.firstLoad = false;
        },
        checkFirstLoad() {
            var data = JSON.parse(localStorage.getItem("SECSData"));

            if (data === null) {
                return false;
            }
            return true;
        },
        saveData() {
            var data = JSON.parse(localStorage.getItem("SECSData"));

            const miscObject = {};

            miscObject.firstLoad = this["firstLoad"];

            miscObject.seenConvos = this["seenConvos"];

            data.misc = miscObject;

            localStorage.setItem("SECSData", JSON.stringify(data));
        },
        loadData() {
            var data = JSON.parse(localStorage.getItem("SECSData"));

            this["firstLoad"] = data.misc.firstLoad;
            this["seenConvos"] = data.misc.seenConvos;

            this.calculateCultistLimit();
        }*/
    }
})