<script setup>
const props = defineProps({
    message: String,
    character: String
})
</script>

<template>
    <div v-bind:class="props.character == 'barty' ? '': 'nonBartyText'" class="textLogSegment">{{ props.message }}</div>
</template>