<script setup>
import ActionList from '../ActionList.vue';

import { useLairStore } from '@/stores/lair';
import { useProgressionStore } from '@/stores/misc/progression';

const lair = useLairStore();
const progression = useProgressionStore();
</script>

<template>

    <b-tabs v-model="lairTab">
        <b-tab-item label="Central Chamber">
            <div>
                <ActionList :piniaObject="lair"/>
            </div> 
        </b-tab-item>
        <b-tab-item label="Farm" v-if="progression.checkUnlocked('completedExpedition')">
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