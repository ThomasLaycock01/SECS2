<script setup>
const props = defineProps({
    perk: Object,
    cultist: Object
})
</script>

<template>

    <div>
        <b>{{props.perk.name}}<span v-if="props.cultist.checkIfHasPerk(props.perk.id)"> [UNLOCKED]</span></b>

        <p>{{ props.perk.desc }}</p>

        <p>{{ props.perk.effectDesc }}</p>
    </div>

</template>