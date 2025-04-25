<script setup>
import { onMounted, useTemplateRef } from 'vue';

import Tooltip from './Tooltip.vue';

import { useTooltipsStore } from '@/stores/misc/tooltips';

import { buttonCheck, tooltip } from '@/functions';


const props = defineProps({
    piniaObject: Object
})

const tooltips = useTooltipsStore();

const test = useTemplateRef('test');

function mouveOverTest(e) {{
    const centerPoint = e.target.getBoundingClientRect().width / 2;
    const relativeCenterPoint = e.target.getBoundingClientRect().left + centerPoint;

    const bottom = e.target.getBoundingClientRect().bottom;
    
    tooltips.toggleShowing();

    test.value.place(bottom, relativeCenterPoint);
}}
</script>


<template>

    <span v-for="action in props.piniaObject.getActions">
        <div v-if="buttonCheck(action)">
            <div class="title is-5 mb-1 segment-title">{{ action.name }}</div>
            <span v-for="button in action.buttons">
                <button v-if="button.showCondition()" :disabled="!button.condition()" @click="button.effect" class="button mb-1 mr-2" :class="button.owned && button.owned() == button.limit() ? 'is-light' : 'is-dark'" @mouseenter="tooltip" @mouseleave="tooltips.hideTooltip()">{{ button.name }}</button>
            </span>
        </div>
    </span>

</template>