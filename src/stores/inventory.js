import { defineStore } from "pinia";

import { createItem } from "@/functions";

import items from "../assets/items.json";

export const useInventoryStore = defineStore("inventory", {
    state: () => {
        return {
            inventory: [

            ],
            itemIndex: {

            },
            misc: {
                inventorySize: 100
            }
        }
    },
    getters: {
        getInventory(state) {
            return state.inventory;
        },
        getUnusedSpaces(state) {
            return state.misc.inventorySize - state.inventory.length;
        },
        getItemDataById(state) {
            return (itemId) => state.itemIndex[itemId];
        }
    },
    actions: {
        loadItemIndex() {
            this.itemIndex = items;
        },
        addItem(itemId, amount) {
            //for now - just add the item with no stack
            const item = createItem(itemId, amount);

            if (this.inventory.length < this.misc.inventorySize) {
                this.inventory.push(item);
            }
        }
    }
})