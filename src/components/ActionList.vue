<script setup>
import { useTooltipsStore } from '@/stores/misc/tooltips';

import { buttonCheck, tooltip } from '@/functions';


const props = defineProps({
    piniaObject: Object
})

const tooltips = useTooltipsStore();
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