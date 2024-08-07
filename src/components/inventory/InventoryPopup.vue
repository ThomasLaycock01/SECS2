<script setup>
import { useInventoryStore } from '@/stores/inventory';

const inventory = useInventoryStore();

const props = defineProps({
    object: Object
})

function sellButtonClick() {
    props.object.sellThis();
}

</script>




<template>
    <div>
        <h6>{{props.object.name}} x{{props.object.amount}}</h6>
        <p>Tier {{ props.object.tier }}</p>
        <p>Sell value: {{ props.object.returnSellValue() }} Gold ({{ props.object.sellPrice }} apiece)</p>

        <button class="button is-danger" @click="sellButtonClick">Sell</button>

    </div>

</template>