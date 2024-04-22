import { useResourcesStore } from "./stores/resources.js";

import { addCultist } from "./functions.js";

export const actions = {
    //actions are stored as objects that then get rendered to the dom
    centralChamber: {
        acquireGold: {
            id: "acquireGold",
            name: "Acquire Gold",
            effect(){
                //gotta do this since pinia needs instantiating first - feels dumb but idk how to do it better
                const resources = useResourcesStore();
                resources.modifyResource("Gold", 1);
            },
            condition(){return true},
        },
        beEvil: {
            id: "beEvil",
            name: "Be Evil >:)",
            effect(){
                const resources = useResourcesStore();
                resources.modifyResource("Evilness", 1);
            },
            condition(){return true},
        },
        hireCultist: {
            id: "hireCultist",
            name: "Hire Cultist",
            effect() {
                addCultist();
            },
            condition() {
                const resources = useResourcesStore();
                return resources.getResourceTotal("Gold") >= 20;
            }
        }
    }
}