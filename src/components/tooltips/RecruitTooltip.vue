<script setup>
import { useResourcesStore } from '@/stores/globalPinias/resources';
import { useCultistsStore } from '@/stores/globalPinias/cultists';

const props = defineProps({
    raceId: String
})

const resources = useResourcesStore();
const cultists = useCultistsStore();

const raceTooltip = cultists.getRaceTooltipObj(props.raceId);
const costs = cultists.getRaceCosts(props.raceId);
</script>

<template>

    <div>
        <div class="mb-2">
            {{ raceTooltip.desc }}
        </div>
        <div class="mb-2">
            {{ raceTooltip.effectDesc }}
        </div>
        <div>
            <ul>
                <li v-for="value, key in costs" :class="resources.checkIfCanAfford({[key]: value}) ? '' : 'redCost'">
                    {{ resources.getName(key) }}: {{ value }}
                </li>
            </ul>
        </div>
    </div>

</template>