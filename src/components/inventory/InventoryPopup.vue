<script setup>
import { useInventoryStore } from '@/stores/inventory';

const inventory = useInventoryStore();

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
        <h6>{{props.object.name}}</h6>
        <p>Tier {{ props.object.tier }}</p>
        <p>Sell value: {{ props.object.getSellPrice() }} Gold</p>

        <button class="button is-danger" @click="sellButtonClick">Sell</button>
        <br>
        <br>
        
        <button class="button is-small is-danger" @click="closeButtonClick">Close</button>

    </div>

</template>