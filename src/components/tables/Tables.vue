<script setup>
import Resource from "./Resource.vue";

import {useResourcesStore} from "@/stores/globalPinias/resources.js";
import { useCultistsStore } from "@/stores/globalPinias/cultists";
import { useHRStore } from "@/stores/HR";

const resources = useResourcesStore();
const cultists = useCultistsStore();
const HR = useHRStore();
</script>

<template>
    <div class="tables" >
        <table class="table">
            <thead>
                <tr>
                    <th>Resources</th>
                    <th></th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                <Resource v-for="(object, resource) in resources.getAll" :object="object"/>
            </tbody>
        </table>
        <table class="table">
            <tbody>
                <tr>
                    <th>Cultists</th>
                    <th></th>
                    <th>{{ cultists.numOfCultists }} / {{ HR.getCultistLimit }}</th>
                </tr>
            </tbody>
        </table>
    </div>
    
</template>