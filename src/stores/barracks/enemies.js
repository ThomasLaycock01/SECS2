import { defineStore } from "pinia";

import { useResourcesStore } from "../globalPinias/resources";

import { Enemy } from "@/classes/Enemy";

import enemies from "@/assets/json/enemies.json";


export const useEnemiesStore = defineStore("enemies", {
    state: () => {
        return {
            enemies: {
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

            for (var i in lootObj) {
                if (!resources.checkIfLocked(i)) {
                    resources.modifyResource(i, lootObj[i]);
                }
            }
        }
    }
})