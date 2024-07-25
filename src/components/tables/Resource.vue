<script setup>
const props = defineProps({
    object: Object
})
</script>

<template>
    <tr v-if="props.object.showCondition()">
        <td>{{ props.object.name }}</td>
        <td>{{ props.object.total.toLocaleString("en-GB") }}</td>
        <td>{{ props.object.perSec }} /s</td>
    </tr>
</template>