<script setup>
import { reactive } from 'vue';

import Tooltip from './Tooltip.vue';


const props = defineProps({
    piniaObject: Object
})


var tooltip = reactive({id: null});

function mouseEnterFunction(e) {
    tooltip.id = e.target.value;
}

function mouseLeaveFunction(e) {
    tooltip.id = null;
}
</script>


<template>

    <span v-for="action in props.piniaObject.getActions">
        <div>
            <div class="title is-5 mb-1 segment-title">{{ action.name }}</div>
            <span v-for="button in action.buttons">
                <button v-if="button.showCondition()" :disabled="!button.condition()" @click="button.effect" @mouseenter="mouseEnterFunction" @mouseleave="mouseLeaveFunction" :value="button.id" class="button is-dark mb-1 mr-2">{{ button.name }}</button>
                <span v-if="tooltip.id == button.id">
                    <Tooltip class="tooltip" :name="button.name" :desc="button.desc" :effectDesc="button.effectDesc" :costs="button.costs"/>
                </span>
            </span>
        </div>
    </span>

</template>