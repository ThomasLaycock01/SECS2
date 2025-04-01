import { defineStore } from "pinia";

import { useResourcesStore } from "./resources";
import { useCultistsStore } from "./cultists";

import { Item } from "@/classes/Item";

import items from "@/assets/json/items.json";
import { useProgressionStore } from "../misc/progression";

export const useInventoryStore = defineStore("inventory", {
    state: () => {
        return {
            inventory: [

            ],
            items: {

            },
            misc: {
                selectedItem: null
            }
        }
    },
    getters: {
        getInventory(state) {
            return state.inventory;
        },
        getnumOfitems(state) {
            return state.inventory.length;
        },
        getItemById(state) {
            return (id) => state.inventory.find((obj) => obj.id == id)
        },
        getItemByType(state) {
            return (type) => {
                return state.inventory.filter(obj => obj.getType() == type);
            }
        },
        getUnequippedItems(state) {
            return state.inventory.filter(obj => obj.getEquippedCultist() == null)
        },
        getUnequippedItemByType(state) {
            return (type) => {
                return state.inventory.filter(obj => obj.getType() == type && obj.getEquippedCultist() == null);
            }
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
        addItem(itemId) {
            const progression = useProgressionStore();

            const id = this.generateItemId();
            const template = this.items[itemId];
            const newItem = new Item(id, template);
            this.inventory.push(newItem);

            progression.updateProgression();
        },
        removeItem(id) {
            this.inventory = this.inventory.filter((obj) => obj.getId() != id);
        },
        sellItem(id) {
            const resources = useResourcesStore();

            const item = this.inventory.find((obj) => obj.getId() == id);

            resources.modifyResource("gold", item.getSellValue());

            this.removeItem(item.getId());
        },
        sellAllUnequipped() {
            for (var i = this.inventory.length - 1; i >=0 ; i--) {
                const item = this.inventory[i];
                if (!item.getEquippedCultist()) {
                    this.sellItem(item.getId());
                }
            }
        },
        setSelectedItem(val) {
            this.misc.selectedItem = val;
        },
        removeSelectedItem() {
            this.misc.selectedItem = null;
        },
        instantiateItems() {
            this.items = items;
        }
    }
})