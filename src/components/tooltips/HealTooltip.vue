<script setup>
import { useResourcesStore } from '@/stores/globalPinias/resources';

const props = defineProps({
    healCost: Function
})

const resources = useResourcesStore();
</script>


<template>

    <div>
        <div v-if="props.healCost() > 0">
            <ul>
                <li :class="resources.checkIfCanAfford({'grain': props.healCost()}) ? '' : 'redCost'">
                    {{ resources.getName("grain") }}: {{ Math.floor(props.healCost() * 100) / 100 }}
                </li>
            </ul>
        </div>
        <div v-else>
            Aready at full health!
        </div>
    </div>

</template>