<script setup>
import { useLairStore } from '@/stores/lair';

const lair = useLairStore();

</script>

<template>

    <div>
        <span v-for="action in lair.getActions">
            <button v-if="action.showCondition()" :disabled="!action.condition()" @click="action.effect"  class="button is-dark mb-1 mr-2">{{ action.name }}</button>
        </span>
    </div> 

</template>