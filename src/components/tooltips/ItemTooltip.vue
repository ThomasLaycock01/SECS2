<script setup>
const props = defineProps({
    item: Object
})
</script>

<template>

    <div>
        <b class="mb-2">
            {{item.getName()}}
        </b>
        <p class="mb-2">
            {{ item.getType() }}
        </p>
        <p class="mb-2">
            {{ item.getEffectDesc() }}
        </p>
        <div class="mb-2">
            <div v-if="item.getEquippedCultist()">
                Equipped by {{ item.getEquippedCultist().getName() }}
            </div>
            <div v-else>
                Not Equipped
            </div>
        </div>
        <p>
            Sell value: {{ item.getSellValue() }} Gold
        </p>
        
    </div>

</template>