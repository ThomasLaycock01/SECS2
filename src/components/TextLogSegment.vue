<script setup>
import { onMounted, ref } from 'vue';

import { useTextLogStore } from '@/stores/textLog';

const props = defineProps({
    message: String,
    typing: Boolean
})

var charIndex = 0;
var displayText = ref("")

function typeText() {
    if (charIndex < props.message.length) {
        displayText.value += props.message[charIndex];
        charIndex += 1;
        setTimeout(() => {
            typeText();
        }, 100);
    }
}

onMounted(() => {
    typeText()
});
</script>

<template>
    <div>{{ displayText }}</div>
</template>