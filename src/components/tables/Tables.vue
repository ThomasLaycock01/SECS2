<script setup>
import Resource from "./Resource.vue";

import {useResourcesStore} from "@/stores/resources.js";
import { useMiscStore } from "@/stores/misc";

const resources = useResourcesStore();
const misc = useMiscStore();
</script>

<template>
    <div class="tables" >
        <table class="table" v-if="misc.checkHasSeenConvo(1)">
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
        <table class="table" v-if="misc.checkHasSeenConvo(1)">
            <tbody>
                <tr>
                    <th>Cultists</th>
                    <th></th>
                    <th>{{ misc.getCultistOwned }} / {{ misc.getCultistLimit }}</th>
                </tr>
            </tbody>
        </table>
    </div>
    
</template>