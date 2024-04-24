<script setup>
const props = defineProps({
    job: Object,
    cultist: Object
})
</script>

<template>
    <div>
        {{ props.cultist.getName() }} - Producing {{ props.cultist.getStat(props.job.stat) * props.job.output }} /s
    </div>
</template>