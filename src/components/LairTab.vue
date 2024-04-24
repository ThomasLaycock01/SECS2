<script setup>
import {actions} from "@/actions.js";
</script>

<template>

    <div>
        <span v-for="segment in actions">
            <div v-if="segment.showCondition()">
                <div class="title is-4 mb-1 segment-title">{{segment.name}}</div>
                <span v-for="button in segment.buttons">
                    <button v-if="button.showCondition()" :disabled="!button.condition()" @click="button.effect" class="button is-dark mb-1 mr-2">{{ button.name }}</button>
                </span>
            </div>
        </span>
    </div> 

</template>