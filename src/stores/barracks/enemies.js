import { defineStore } from "pinia";

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
        generateNewEnemy(id, area) {
            const template = this.enemies[id];

            return new Enemy(template, area);
        }
    }
})