<script setup>
import { useBuildingsStore } from '@/stores/globalPinias/buildings';
import { useResourcesStore } from '@/stores/globalPinias/resources';

const props = defineProps({
    buildingId: String
})

const buildings = useBuildingsStore();
const resources = useResourcesStore();
</script>


<template>

    <div>
        <div v-if="!buildings.getOwned(buildingId) || !(buildings.getOwned(buildingId) == buildings.getLimit(buildingId))" class="mb-2">
            <ul>
                <li v-for="value, key in buildings.getCosts(buildingId)" :class="resources.checkIfCanAfford({[key]: value}) ? '' : 'redCost'">
                    {{ resources.getName(key) }}: {{ value }}
                </li>
            </ul>
        </div>
        <div v-if="buildings.getOwned(buildingId)">
            Owned -  {{buildings.getOwned(buildingId)}}  /  {{buildings.getLimit(buildingId)}}
        </div>
    </div>

</template>