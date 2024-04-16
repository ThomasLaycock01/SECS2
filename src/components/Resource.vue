<script setup>

import {useResourcesStore} from "@/stores/resources.js";

const resources = useResourcesStore()

defineProps({
    resource: String
})
</script>

<template>
    <tr>
        <td>{{ resource }}</td>
        <td>{{ resources[resource] }}</td>
    </tr>
</template>