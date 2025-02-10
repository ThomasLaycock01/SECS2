<script setup>
import ActionList from '../ActionList.vue';

import { useLairStore } from '@/stores/lair';
import { useProgressionStore } from '@/stores/misc/progression';
import { useExpansionsStore } from '@/stores/globalPinias/expansions';

const lair = useLairStore();
const expansions = useExpansionsStore();
</script>

<template>

    <b-tabs v-model="lairTab">
        <b-tab-item label="Central Chamber">
            <div>
                <ActionList :piniaObject="lair"/>
            </div> 
        </b-tab-item>
        <b-tab-item label="Farm" v-if="expansions.checkIfBuilt('farm')">
            Farm
        </b-tab-item>
    </b-tabs>

</template>

<script>

    export default {
        data() {
            return {lairTab: 0}
        }
    }

</script>