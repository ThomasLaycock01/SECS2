<script setup>
import Resource from "./Resource.vue";

import {useResourcesStore} from "@/stores/resources.js";
import { storeToRefs } from "pinia";

const resources = useResourcesStore();

console.log(storeToRefs(resources));

for (var resource in storeToRefs(resources)) {
    console.log(resource);
}
</script>

<template>
    <table>
        <thead>
            <tr>
                <th>Resources</th>
            </tr>
        </thead>
            <Resource v-for="(amount, resource) in storeToRefs(resources)" :resource="resource"/>
        <tbody>
            
        </tbody>
    </table>
</template>