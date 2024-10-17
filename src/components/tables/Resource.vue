<script setup>
import { useResourcesStore } from '@/stores/globalPinias/resources';

const resources = useResourcesStore();

const props = defineProps({
    object: Object
})
</script>

<template>
    <tr v-if="!resources.checkIfLocked(props.object.id) && !resources.checkIfResourceHasProperty(props.object.id, 'alwaysLocked')">
        <td>{{ props.object.name }}</td>
        <td>{{ (Math.round(props.object.total * 100) / 100).toLocaleString("en-GB") }}</td>
        <td>{{ Math.round(props.object.perSec * 100) / 100 }} /s</td>
    </tr>
</template>