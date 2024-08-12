import { defineStore } from "pinia";

import { useExpansionsStore } from "./expansions";
import { useCultistsStore } from "./cultists";
import { useBuildingsStore } from "./buildings";

export const useMiscStore = defineStore("misc", {
    state: () => {
        return {
            cultistLimit: 2,
            firstLoad: true,
            seenConvos:[],
            xpOutput: 1,
            defaultLevelLimit: 10
        }
    },
    getters: {
        getCultistLimit(state) {
            return state.cultistLimit;
        },
        getSeenConvos(state) {
            return state.seenConvos;
        },
        checkHasSeenConvo(state) {
            return (convoId) => state.seenConvos.includes(convoId);
        },
        getXpOutput(state) {
            return state.xpOutput;
        },
        getDefaultLevelLimit(state) {
            return state.defaultLevelLimit;
        }
    },
    actions: {
        calculateCultistLimit() {
            const expansions = useExpansionsStore();
            const buildings = useBuildingsStore();

            var totalLimit = 2;

            for (var i in expansions.getBuilt) {
                totalLimit += 2;
            }

            for (var i in buildings.getCultistLimitBuildings()) {
                totalLimit += buildings.getCultistLimitBuildings()[i]["owned"];
            }

            this.cultistLimit = totalLimit;
        },
        calculateLevelLimit() {
            const buildings = useBuildingsStore();

            var totalLimit = 10;

            for (var i in buildings.getLevelLimitBuildings()) {
                totalLimit += buildings.getLevelLimitBuildings()[i]["owned"];
            }

            console.log(totalLimit);

            this.defaultLevelLimit = totalLimit;
        },
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
        setXpOutput(value) {
            this["xpOutput"] = value;
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
        }
    }
})