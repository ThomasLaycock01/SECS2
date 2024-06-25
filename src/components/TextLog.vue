<script setup>
import TextLogSegment from './TextLogSegment.vue';

import { useTextLogStore } from '@/stores/textLog';

const textLog = useTextLogStore();
</script>

<template>
    <div class="textLog">
        <div v-for="i in textLog.getPlayed">
            <div v-for="j in i.messages">
                <TextLogSegment :message="j.message"/>
            </div>
        </div>
    </div>
</template>