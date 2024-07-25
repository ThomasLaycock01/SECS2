<script setup>
import Resource from "./Resource.vue";

import {useResourcesStore} from "@/stores/resources.js";
import { useMiscStore } from "@/stores/misc";
import { useCultistsStore } from "@/stores/cultists";
import { useExpansionsStore } from "@/stores/expansions";

const resources = useResourcesStore();
const misc = useMiscStore();
const cultists = useCultistsStore();
const expansions = useExpansionsStore();
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
                <Resource v-for="(object, resource) in resources.getAll" :object="object"/>
            </tbody>
        </table>
        <table class="table" v-if="misc.checkHasSeenConvo(2)">
            <tbody>
                <tr>
                    <th>Cultists</th>
                    <th></th>
                    <th>{{ cultists.numOfCultists }} / {{ misc.getCultistLimit }}</th>
                </tr>
                <tr v-if="expansions.hasTier1">
                    <td>Employed Cultists earn {{ misc.getXpOutput }} XP per second</td>
                </tr>
            </tbody>
        </table>
    </div>
    
</template>