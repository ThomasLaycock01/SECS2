<script setup>
import { onMounted, ref } from 'vue';

import { useTextLogStore } from '@/stores/textLog';

const props = defineProps({
    message: String
})
</script>

<template>
    <div>{{ props.message }}</div>
</template>