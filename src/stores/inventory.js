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
                inventorySize: 10
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
        },
        checkFreeSpace(state) {
            return state.inventory.length < state.misc.inventorySize;
        }
    },
    actions: {
        loadItemIndex() {
            this.itemIndex = items;
        },
        generateStackId() {
            var id = 0;
            const self = this;

            const idUsed = function(id) {
                for (var i in self.inventory) {
                    if (self.inventory[i].getStackId() == id) {
                        return true;
                    }
                }
                return false;
            }

            while (idUsed(id)) {
                id++
            }
            return id;
        },
        addItem(itemId, amount) {

            for (var i in this.inventory) {
                if (this.inventory[i].checkSameId(itemId)) {
                    amount = this.inventory[i].addAllPossible(amount);
                    if (amount == 0) {
                        break;
                    }
                }
            }

            console.log(this.checkFreeSpace)

            if (amount > 0 && this.checkFreeSpace) {
                const item = createItem(itemId, amount);
                this.inventory.push(item);
            }
            console.log(amount);
        },
        removeItem(stackId) {
            this.inventory = this.inventory.filter((item) => item.stackId != stackId);
        }
    }
})