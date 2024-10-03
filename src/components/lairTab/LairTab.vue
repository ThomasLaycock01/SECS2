<script setup>
import ActionList from '../ActionList.vue';

import { useLairStore } from '@/stores/lair';

const lair = useLairStore();
</script>

<template>

    <div>
        <ActionList :piniaObject="lair"/>
    </div> 

</template>