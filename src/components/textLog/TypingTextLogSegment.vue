<script setup>
import { useTextLogStore } from '@/stores/textLog';
import { ref, onMounted } from 'vue';

const props = defineProps({
    message: String,
    character: String
})

var charIndex = 0;
var displayText = ref("");

function typeText(string) {
    const textLog = useTextLogStore();
    if (charIndex < string.length) {
        displayText.value += string[charIndex];
        charIndex += 1;

        if (charIndex == string.length) {
            textLog.movePlayingIntoPlayed();
        }
        else {
            setTimeout(() => {
            typeText(string);
            }, 60);
        }
        
    }
}

onMounted(() => {
    typeText(props.message)
    });
</script>

<template>
    <div v-bind:class="props.character == 'barty' ? '': 'nonBartyText'" class="textLogSegment">{{ displayText }}</div>
</template>