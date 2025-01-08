<script setup>
import { useExploreStore } from '@/stores/barracks/explore';

const explore = useExploreStore();
</script>


<template>

<div class="title is-5 mb-1 segment-title">Explore</div>
<div v-for="i in explore.getAreas">
    <p>{{ i.name }}</p>
    <button class="button is-dark">Embark</button>
</div>

</template>