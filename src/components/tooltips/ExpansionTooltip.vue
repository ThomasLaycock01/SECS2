<script setup>
import { useExpansionsStore } from '@/stores/globalPinias/expansions';
import { useResourcesStore } from '@/stores/globalPinias/resources';

const props = defineProps({
    expansionId: String
})

const expansions = useExpansionsStore();
const resources = useResourcesStore();
</script>


<template>

    <div>
        <div v-if="!expansions.checkIfBuilt(expansionId)" class="mb-2">
            <ul>
                <li v-for="value, key in expansions.getCosts(expansionId)" :class="resources.checkIfCanAfford({[key]: value}) ? '' : 'redCost'">
                    {{ resources.getName(key) }}: {{ value }}
                </li>
            </ul>
        </div>
        <div v-else>
            Unlocked!
        </div>
    </div>

</template>