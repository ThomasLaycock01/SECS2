<script setup>
import ActionList from '../ActionList.vue';

import { useMetalmancerStore } from '@/stores/metalmancer';

const metalmancer = useMetalmancerStore();
</script>

<template>

    <div>
        <ActionList :pinia-object="metalmancer"/>
    </div>

</template>