<script setup>
import { useTextLogStore } from '@/stores/misc/textLog';

const textLog = useTextLogStore();
</script>


<template>
    <div>
        <div v-for="i in textLog.getMessagesInLog">
            <div>{{ i.text }}</div>
            <br>
        </div>
    </div>
</template>