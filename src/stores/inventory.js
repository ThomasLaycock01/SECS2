import { defineStore } from "pinia";

import { useResourcesStore } from "./resources";
import { useCultistsStore } from "./cultists";

import { Item } from "@/classes/Item";

export const useInventoryStore = defineStore("inventory", {
    state: () => {
        return {
            inventory: [

            ],
            misc: {
                inventorySize: 10,
                selectedItem: null
            }
        }
    },
    getters: {
        getInventory(state) {
            return state.inventory;
        },
        getItemById(state) {
            return (id) => state.inventory.find((obj) => obj.id == id)
        },
        getItemByType(state) {
            return (type) => {
                return state.inventory.filter(obj => obj.getType() == type);
            }
        },
        getUnequippedItemByType(state) {
            return (type) => {
                return state.inventory.filter(obj => obj.getType() == type && obj.getEquippedCultistId() == null);
            }
        },
        getUnusedSpaces(state) {
            return state.misc.inventorySize - state.inventory.length;
        },
        checkFreeSpace(state) {
            return state.inventory.length < state.misc.inventorySize;
        },
        getSelectedItem(state) {
            return state.misc.selectedItem;
        }
    },
    actions: {
        generateItemId() {
            const idArray = [];
            var returnId = 0;

            for (var i in this.getInventory) {
                idArray.push(this.getInventory[i].getId());
            }

            while (idArray.includes(returnId)) {
                returnId++;
            }

            return returnId;
        },
        addItem(itemObj) {
            if (!this.checkFreeSpace) {
                return;
            }
            const id = this.generateItemId();
            const newItem = new Item(id, itemObj);
            this.inventory.push(newItem);
        },
        removeItem(id) {
            this.inventory = this.inventory.filter((obj) => obj.getId() != id);
        },
        sellItem(id) {
            const resources = useResourcesStore();
            const cultists = useCultistsStore();

            const item = this.inventory.find((obj) => obj.getId() == id);

            resources.modifyResource("gold", item.getSellPrice());

            if (item.getEquippedCultistId() != null) {
                cultists.getCultistById(item.getEquippedCultistId()).unequipItem(item.getType());
            }

            this.removeItem(item.getId());
        },
        setSelectedItem(val) {
            this.misc.selectedItem = val;
        },
        removeSelectedItem() {
            this.misc.selectedItem = null;
        }
    }
})