<script setup>
import Resource from "./Resource.vue";

import {useResourcesStore} from "@/stores/resources.js";
import { useMiscStore } from "@/stores/misc";
import { useCultistsStore } from "@/stores/cultists";

const resources = useResourcesStore();
const misc = useMiscStore();
const cultists = useCultistsStore();
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
            <tbody> <!--Using getGlobal for now - remember to update to getALl-->
                <Resource v-for="(object, resource) in resources.getAll" :object="object"/>
            </tbody>
        </table>
        <table class="table">
            <tbody>
                <tr>
                    <th>Cultists</th>
                    <th></th>
                    <th>{{ cultists.numOfCultists }} / {{ misc.getCultistLimit }}</th>
                </tr>
            </tbody>
        </table>
    </div>
    
</template>