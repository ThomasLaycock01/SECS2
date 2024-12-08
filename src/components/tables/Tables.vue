<script setup>
import Resource from "./Resource.vue";

import {useResourcesStore} from "@/stores/globalPinias/resources.js";
import { useCultistsStore } from "@/stores/globalPinias/cultists";
import { useExpansionsStore } from "@/stores/globalPinias/expansions";

const resources = useResourcesStore();
const cultists = useCultistsStore();
const expansions = useExpansionsStore();
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
                    <th>{{ cultists.getNumOfRegular }} / {{ cultists.getRegularLimit }}</th>
                </tr>
                <tr v-if="expansions.checkIfSummonAvailable">
                    <th>Summons</th>
                    <th></th>
                    <th>{{ cultists.getNumOfSummoned }} / {{ cultists.getSummonLimit }}</th>
                </tr>
            </tbody>
        </table>
    </div>
    
</template>