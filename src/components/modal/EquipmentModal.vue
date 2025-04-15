<script setup>
import { reactive } from 'vue';

import { useInventoryStore } from '@/stores/globalPinias/inventory';
import { useModalsStore } from '@/stores/misc/modal';

const inventory = useInventoryStore();
const modals = useModalsStore();

const cultist = modals.getEquipmentCultist;
const type = modals.getEquipmentType;

var equipmentModal = reactive({selectedItem: null});

function setSelectedItem(item) {
    equipmentModal.selectedItem = item;
}
</script>


<template>
    <div class="modalBackdrop"></div>

<div class="generalModal">
    <div class="modalHeader">
        <p>Equipping {{cultist.getName()}} - {{ type }}</p>
    </div>

    <div class="modalBody">
        <div class="columns partyColumns">
            <div class="column is-three-quarters">
                <div class="title is-5 mb-1 segment-title">Inventory</div>
                <div class="equipmentGridContainer" v-if="inventory.getItemByType(type).length > 0">
                    <span v-for="i in inventory.getItemByType(type)">
                        <div>
                            <button class="button" :class="cultist.getEquipment(type) && cultist.getEquipment(type).getId() == i.getId() ? 'is-info' : 'is-dark'" @click="setSelectedItem(i)">{{ i.getShortName() ? i.getShortName() : i.getName() }}</button>
                        </div>
                    </span>
                </div>
                <div v-else>No items available!</div>
            </div>
            <div class="column is-one-quarter">
                <div class="title is-5 mb-1 segment-title">Item</div>
                <div v-if="equipmentModal.selectedItem">
                    <div>{{ equipmentModal.selectedItem.getName() }}</div>
                    <p class="mb-2">{{ equipmentModal.selectedItem.getEffectDesc() }}</p>
                    <p v-if="equipmentModal.selectedItem.getEquippedCultist()">Currently equipped by {{ equipmentModal.selectedItem.getEquippedCultist().getName() }}</p>
                    <span v-if="cultist.getEquipment(type) && cultist.getEquipment(type).getId() == equipmentModal.selectedItem.getId()">
                        <button class="button is-danger" @click="cultist.unequipItem(type)">Unequip</button>
                    </span>
                    <span v-else>
                        <button class="button is-dark" @click="cultist.equipItem(equipmentModal.selectedItem)" :disabled="equipmentModal.selectedItem.getEquippedCultist()">Equip</button>
                    </span>
                </div>
                <div v-else>No Item selected</div>
            </div>
        </div>

    </div>

    <div class="modalFooter">
        <button class="button is-dark" @click="modals.closeEquipment()">Close</button>
    </div>

</div>
</template>