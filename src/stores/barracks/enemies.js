import { defineStore } from "pinia";

import { useResourcesStore } from "../globalPinias/resources";

import { Enemy } from "@/classes/Enemy";

import enemies from "@/assets/json/enemies.json";


export const useEnemiesStore = defineStore("enemies", {
    state: () => {
        return {
            enemies: {
            },
            lootTables: {
                0: [
                    {type: "resource", resource: "gold", base: 10}
                ]
            }
        }
    },
    getters: {
    },
    actions: {
        instantiateEnemies() {
            this.enemies = enemies;
        },
        generateNewEnemy(templateId, area, id) {
            const template = this.enemies[templateId];

            return new Enemy(template, area, id);
        },
        giveLoot(lootObj) {
            const resources = useResourcesStore();

            const table = lootObj.table;
            const modifier = lootObj.modifier;

            const randIndex = Math.floor(Math.random() * this.lootTables[table].length);

            const chosenLoot = this.lootTables[table][randIndex];

            switch (chosenLoot.type) {
                case "resource":
                    resources.modifyResource(chosenLoot.resource, chosenLoot.base * modifier);
                    break;
                default:
                    console.log("error in giveLoot()");
            }
        }
    }
})