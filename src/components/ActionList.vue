<script setup>
import Tooltip from './Tooltip.vue';

import { ref } from 'vue';

const props = defineProps({
    actions: Object
})

var hover = ref("");
</script>




<template>
     <span v-for="segment in actions">
            <div v-if="segment.showCondition()">
                <div class="title is-4 mb-1 segment-title">{{segment.name}}</div>
                <div class="button_list">
                    <div v-for="button in segment.buttons">
                        <button v-if="button.showCondition()" :disabled="!button.condition()" @click="button.effect" @mouseover="hover = button.id" @mouseleave="hover = ''"  class="button is-dark mb-1 mr-2">{{ button.name }}</button>
                        <div v-if="hover == button.id" class="tooltip_container" >
                            <Tooltip class="tooltip" :tooltipData="button.tooltipData"/>
                        </div>
                    </div>
                </div>
            </div>
        </span>
</template>