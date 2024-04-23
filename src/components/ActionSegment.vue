<script setup>
import {actions} from "@/actions.js";

console.log(actions);
</script>

<template>

    <div>
        <div v-for="segment in actions">
            <div class="title is-4 mb-1 segment-title">{{segment.name}}</div>
            <span v-for="button in segment.buttons">
                <button v-if="button.condition()" @click="button.effect" class="button is-dark mb-1 mr-2">{{ button.name }}</button>
            </span>
        </div>
    </div> 

</template>