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
            <div>
                <div class="title is-5 mb-1 segment-title">{{ action.name }}</div>
                <span v-for="button in action.buttons">
                    <button v-if="button.showCondition()" :disabled="!button.condition()" @click="button.effect" @mouseenter="mouseEnterFunction" @mouseleave="mouseLeaveFunction" :value="button.id" class="button is-dark mb-1 mr-2">{{ button.name }}</button>
                    <span v-if="tooltip.id == button.id">
                        <Tooltip class="tooltip" :name="button.name" :desc="button.desc" :costs="button.costs"/>
                    </span>
                </span>
            </div>
            <!--
            -->
        </span>
    </div> 

</template>