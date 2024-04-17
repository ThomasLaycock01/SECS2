<script setup>
import { toRefs } from 'vue';

import { useCultistsStore } from '@/stores/cultists';

const cultists = useCultistsStore();

const props = defineProps({
    cultistId: Number
})

const {cultistId} = toRefs(props);

const cultist = cultists.getCultistById(cultistId.value)
</script>

<template>
    <div>
        <h5>{{cultist.name}}</h5>
        <p>{{cultist.id}}</p>
        <p>{{ cultist.job }}</p>
    </div>
</template>