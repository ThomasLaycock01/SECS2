<script setup>
const props = defineProps({
    message: String
})
</script>

<template>
    <div>{{ props.message }}</div>
</template>