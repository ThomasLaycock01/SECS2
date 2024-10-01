<script setup>
import { reactive } from 'vue';

import Tooltip from '../Tooltip.vue';

import { useLairStore } from '@/stores/lair';

const lair = useLairStore();

var tooltip = reactive({id: null});

function mouseEnterFunction(e) {
    tooltip.id = e.target.value;
}

function mouseLeaveFunction(e) {
    tooltip.id = null;
}
</script>

<template>

    <div>
        <span v-for="action in lair.getActions">
            <button v-if="action.showCondition()" :disabled="!action.condition()" @click="action.effect" @mouseenter="mouseEnterFunction" @mouseleave="mouseLeaveFunction" :value="action.id" class="button is-dark mb-1 mr-2">{{ action.name }}</button>
            <span v-if="tooltip.id == action.id">
                <Tooltip class="tooltip" :data="action.tooltipData"/>
            </span>
        </span>
    </div> 

</template>