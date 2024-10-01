<script setup>
const props = defineProps({
    object: Object
})
</script>

<template>
    <tr v-if="props.object.showCondition()">
        <td>{{ props.object.name }}</td>
        <td>{{ (Math.round(props.object.total * 100) / 100).toLocaleString("en-GB") }}</td>
        <td>{{ Math.round(props.object.perSec * 100) / 100 }} /s</td>
    </tr>
</template>