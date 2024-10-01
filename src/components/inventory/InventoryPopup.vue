<script setup>
import { useInventoryStore } from '@/stores/inventory';
import { useCultistsStore } from '@/stores/cultists';

const inventory = useInventoryStore();
const cultists = useCultistsStore();

const props = defineProps({
    object: Object
})

function sellButtonClick() {
    inventory.sellItem(props.object.id);
}

function closeButtonClick() {
    inventory.removeSelectedItem();
}

</script>




<template>
    <div>
        <h6>{{props.object.getName()}}</h6>
        <p>Tier {{ props.object.getTier() }}</p>
        <p>Sell value: {{ props.object.getSellPrice() }} Gold</p>
        <p>Equipped by {{ cultists.getCultistById(props.object.getEquippedCultistId()).getName() }}</p>

        <button class="button is-danger" @click="sellButtonClick">Sell</button>
        <br>
        <br>
        
        <button class="button is-small is-danger" @click="closeButtonClick">Close</button>

    </div>

</template>