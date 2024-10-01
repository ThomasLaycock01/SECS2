<script setup>
const props = defineProps({
    perk: Object,
    unlocked: {
        type: Boolean,
        default: false
    }
});
</script>




<template>

    <div>
        <h6 v-if="unlocked">{{props.perk.name}} [UNLOCKED]</h6>
        <h6 v-else>{{props.perk.name}}</h6>

        <p>{{ props.perk.desc }}</p>

        <p>{{ props.perk.effectDesc }}</p>

    </div>

</template>