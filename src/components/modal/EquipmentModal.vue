<script setup>
import { reactive } from 'vue';

import { useInventoryStore } from '@/stores/globalPinias/inventory';
import { useModalsStore } from '@/stores/misc/modal';

const inventory = useInventoryStore();
const modals = useModalsStore();

const cultist = modals.getEquipmentCultist;

var equipmentModal = reactive({selectedSlot: null, selectedItem: null});

function setSelectedItem(item) {
    equipmentModal.selectedItem = item;
}

function setSelectedSlot(slot) {
    equipmentModal.selectedSlot = slot;
}
</script>


<template>
    <div class="modalBackdrop" @click="modals.closeEquipment()"></div>

<div class="generalModal">
    <div class="modalHeader">
        <p>Equipping {{cultist.getName()}}</p>
    </div>

    <div class="modalBody">
        <div class="columns partyColumns">
            <div class="column is-one-quarter">
                <div class="title is-5 mb-1 segment-title">Slots</div>
                <div v-for="value, key in cultist.getEquipment()" class="mb-2" :class="equipmentModal.selectedSlot == key ? 'selectedPartySlot' : 'partySlot'" @click="setSelectedSlot(key)">
                        <div>{{ key }}: {{ value ? value.getName() : 'Empty' }}</div>
                    </div>
            </div>
            <div class="column is-half">
                <div class="title is-5 mb-1 segment-title">Inventory</div>
                <div v-if="!equipmentModal.selectedSlot"></div>
                <div v-else-if="inventory.getItemByType(equipmentModal.selectedSlot).length == 0">No items available!</div>

                <div class="equipmentGridContainer" v-else>
                    <span v-for="i in inventory.getItemByType(equipmentModal.selectedSlot)">
                        <div>
                            <button class="button" :class="cultist.getEquipment(equipmentModal.selectedSlot) && cultist.getEquipment(equipmentModal.selectedSlot).getId() == i.getId() ? 'is-info' : 'is-dark'" @click="setSelectedItem(i)" :disabled="i.getEquippedCultist() && i.getEquippedCultist().getId() != cultist.getId()">{{ i.getShortName() ? i.getShortName() : i.getName() }}</button>
                        </div>
                    </span>
                </div>
            </div>
            <div class="column is-one-quarter">
                <div class="title is-5 mb-1 segment-title">Item</div>
                <div v-if="!equipmentModal.selectedSlot"></div>
                <div v-else-if="!equipmentModal.selectedItem">No item selected!</div>

                <div v-else>
                    <div>{{ equipmentModal.selectedItem.getName() }}</div>
                    <p class="mb-2">{{ equipmentModal.selectedItem.getEffectDesc() }}</p>
                    <p v-if="equipmentModal.selectedItem.getEquippedCultist()">Currently equipped by {{ equipmentModal.selectedItem.getEquippedCultist().getName() }}</p>
                    <span v-if="cultist.getEquipment(equipmentModal.selectedSlot) && cultist.getEquipment(equipmentModal.selectedSlot).getId() == equipmentModal.selectedItem.getId()">
                        <button class="button is-danger" @click="cultist.unequipItem(equipmentModal.selectedSlot)">Unequip</button>
                    </span>
                    <span v-else>
                        <button class="button is-dark" @click="cultist.equipItem(equipmentModal.selectedItem)" :disabled="equipmentModal.selectedItem.getEquippedCultist()">Equip</button>
                    </span>
                </div>
            </div>
        </div>

    </div>

    <div class="modalFooter">
        <button class="button wideBtn is-dark" @click="modals.closeEquipment()">Close</button>
    </div>

</div>
</template>