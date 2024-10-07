<script setup>
import ActionList from '../ActionList.vue';

import { useForgeStore } from '@/stores/forge';

const forge = useForgeStore();
</script>




<template>

    <div>
        <ActionList :piniaObject="forge"/>
    </div>

</template>