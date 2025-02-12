<script setup>
import ActionList from '../ActionList.vue';

import { useFarmStore } from '@/stores/expansions/farm';
import { useModalsStore } from '@/stores/misc/modal';

const farm = useFarmStore();
const modals = useModalsStore();
</script>


<template>

    <!--Actions-->
    <div>
        <ActionList :piniaObject="farm"/>
    </div>
    <!--Workers-->
    <div>
        <div class="title is-5 mb-1 segment-title">Workers - {{ farm.getNumOfWorkers("farmer") }} / {{ farm.getJobLimit("farmer") }}</div>

        <button class="button is-dark" @click="modals.openAssignment(farm, 'farmer')">Assign Cultists</button>
        <br>
        <!--Displaying workers already working-->
        <div>
            <div v-for="i in farm.getJobArray('farmer')">
                <div>{{ i.getName() }} - Lvl {{ i.getLevel() }}</div>
            </div>
        </div>
    </div>

</template>