<script setup>
import TypingTextLogSegment from './TypingTextLogSegment.vue';
import TextLogSegment from './TextLogSegment.vue';

import { useTextLogStore } from '@/stores/textLog';

const textLog = useTextLogStore();
</script>

<template>
    <div class="textLog">
        <div v-for=" i in textLog.getPlaying">
            <TypingTextLogSegment :message="i.message"/>
        </div>
        <div v-for="i in textLog.getPlayed">
            <TextLogSegment :message="i.message"/>
        </div>
    </div>
</template>