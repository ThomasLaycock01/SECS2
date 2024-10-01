<script setup>
const props = defineProps({
    perk: Object
});
</script>




<template>

    <div>
        <h6>{{props.perk.name}}</h6>

        <p>{{ props.perk.desc }}</p>

        <p>{{ props.perk.effectDesc }}</p>

    </div>

</template>