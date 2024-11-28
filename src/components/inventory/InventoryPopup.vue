<script setup>
import { useInventoryStore } from '@/stores/globalPinias/inventory';
import { useCultistsStore } from '@/stores/globalPinias/cultists';

const inventory = useInventoryStore();
const cultists = useCultistsStore();

const props = defineProps({
    object: Object
})

function sellButtonClick() {
    inventory.sellItem(props.object.id);
    inventory.removeSelectedItem();
}

function closeButtonClick() {
    inventory.removeSelectedItem();
}

</script>




<template>
    <div>
        <h6>{{props.object.getName()}}</h6>
        <p>Tier {{ props.object.getTier() }}</p>
        <p>Sell value: {{ props.object.getSellValue() }} Gold</p>
        <br>
        <p>{{ props.object.getEffectDesc() }}</p>
        <br>
        <span v-if="props.object.getEquippedCultistId() != null">
            <p>Equipped by {{ cultists.getCultistById(props.object.getEquippedCultistId()).getName() }}</p>
        </span>
        <span v-else>
            <p>Not Equipped</p>
        </span>

        <div v-if="props.object.getIsLiving()">
            <br>
            <p>This object is alive!</p>
            <p>Level: {{ props.object.getLevel() }}</p>
            <p>{{ props.object.getCurrentXp() }} / {{ props.object.getXpNeeded() }} XP</p>
            <p>{{props.object.getLivingDesc()}}</p>
            <br>
        </div>

        <button class="button is-danger" @click="sellButtonClick" :disabled="!props.object.getSellAvailable()">Sell</button>
        <br>
        <br>
        
        <button class="button is-small is-danger" @click="closeButtonClick">Close</button>

    </div>

</template>