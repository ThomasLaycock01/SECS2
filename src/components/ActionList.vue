<script setup>
import { useTooltipsStore } from '@/stores/misc/tooltips';
import { useBuildingsStore } from '@/stores/globalPinias/buildings';

import { buttonCheck, tooltip } from '@/functions';


const props = defineProps({
    piniaObject: Object
})

const tooltips = useTooltipsStore();
const buildings = useBuildingsStore();
</script>


<template>

    <span v-for="action in props.piniaObject.getActions">
        <div v-if="buttonCheck(action)">
            <div class="title is-5 mb-1 segment-title">{{ action.name }}</div>
            <span v-for="button in action.buttons">
                <button v-if="button.showCondition()" :disabled="!button.condition()" @click="button.effect" class="button wideBtn  mb-1 mr-2" :class="button.buildingId && buildings.getOwned(button.buildingId) == buildings.getLimit(button.buildingId) ? 'is-light' : 'is-dark'" @mouseenter="tooltip($event, button.tooltip)" @mouseleave="tooltips.hideTooltip()">{{ button.name }}</button>
            </span>
        </div>
    </span>

</template>