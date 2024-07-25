import { defineStore } from "pinia";

import { useResourcesStore } from "./resources";
import { useCultistsStore } from "./cultists";
import { useTextLogStore } from "./textLog";

export const useConvosStore = defineStore("convos", {
    state: () => {
        return {
            seen: [],
            requirements: [
                //convo 0 has no requirements - it fires automatically on the first page load
                {
                    id: 1,
                    requirements() {
                        const resources = useResourcesStore();
                        return resources.getResourceTotal("evilness") >= 1;
                    },
                    completed: false
                },
                {
                    id: 2,
                    requirements() {
                        const resources = useResourcesStore();
                        return resources.getResourceTotal("evilness") >= 10;
                    },
                    completed: false
                },
                {
                    id: 3,
                    requirements() {
                        const cultists = useCultistsStore();
                        return cultists.numOfCultists >= 1;
                    },
                    completed: false
                },
                {
                    id: 4,
                    requirements() {
                        const resources = useResourcesStore();
                        return resources.getResourceTotal("crystals") >= 25;
                    },
                    completed: false
                }

            ]
        }
    },
    getters: {
        getSeen(state) {
            return state.seen;
        }
    },
    actions: {
        playPerRequirements() {
            const textLog = useTextLogStore();

            for (var i in this["requirements"]) {
                if (this["requirements"][i].requirements() && this["requirements"][i]["completed"] == false) {
                    textLog.playConvo(this["requirements"][i]["id"]);
                    this["requirements"][i]["completed"] = true;
                }
            }
        },
        saveData() {
            var data = JSON.parse(localStorage.getItem("SECSData"));

            const convosObject = {};

            for (var i in this["requirements"]) {
                convosObject[i] = this["requirements"][i]["completed"];
            }
            
            data.convos = convosObject;

            localStorage.setItem("SECSData", JSON.stringify(data));
        },
        loadData() {
            var data = JSON.parse(localStorage.getItem("SECSData"));

            for (var i in data.convos) {
                this["requirements"][i]["completed"] = data.convos[i];
            }
        }
    }
})