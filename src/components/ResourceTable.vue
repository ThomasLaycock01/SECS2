<script setup>
import Resource from "./Resource.vue";

import {useResourcesStore} from "@/stores/resources.js";

const resources = useResourcesStore();

</script>

<template>
    <div>
        <table class="table">
            <thead>
                <tr>
                    <th>Resources</th>
                    <th></th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                <Resource v-for="(amount, resource) in resources.getAll" :resource="resource"/>
            </tbody>
        </table>
    </div>
</template>