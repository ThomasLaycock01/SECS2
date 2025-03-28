<script setup>
import { reactive } from 'vue';

import Tooltip from './Tooltip.vue';

import { useTooltipsStore } from '@/stores/misc/tooltips';

import { buttonCheck } from '@/functions';


const props = defineProps({
    piniaObject: Object
})

const tooltips = useTooltipsStore();

//var tooltip = reactive({id: null});
</script>


<template>

    <span v-for="action in props.piniaObject.getActions">
        <div v-if="buttonCheck(action)">
            <div class="title is-5 mb-1 segment-title">{{ action.name }}</div>
            <span v-for="button in action.buttons">
                <button v-if="button.showCondition()" :disabled="!button.condition()" @click="button.effect" @mouseenter="tooltips.setActiveTooltip(button.id)" @mouseleave="tooltips.removeActiveTooltip()" :value="button.id" class="button is-dark mb-1 mr-2">{{ button.name }}</button>
                <span v-if="tooltips.getActiveTooltip == button.id">
                    <Tooltip class="tooltip" :tooltipObj="button" :effectDesc="button.effectDesc" :costs="button.costs" :owned="button.owned" :limit="button.limit"/>
                </span>
            </span>
        </div>
    </span>

</template>