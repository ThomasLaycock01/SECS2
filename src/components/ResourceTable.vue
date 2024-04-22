<script setup>
import Resource from "./Resource.vue";

import {useResourcesStore} from "@/stores/resources.js";

const resources = useResourcesStore();

</script>

<template>
    <table>
        <thead>
            <tr>
                <th>Resources</th>
            </tr>
        </thead>
            <Resource v-for="(amount, resource) in resources.getAll" :resource="resource"/>
        <tbody>
            
        </tbody>
    </table>
</template>