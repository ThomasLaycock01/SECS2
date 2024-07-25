<script setup>
const props = defineProps({
    resource: String,
    object: Object
})
</script>

<template>
    <tr v-if="props.object.showCondition()">
        <td>{{ props.resource }}</td>
        <td>{{ props.object.total.toLocaleString("en-GB") }}</td>
        <td>{{ props.object.perSec }} /s</td>
    </tr>
</template>