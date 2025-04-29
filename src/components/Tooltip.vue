<script setup>
import { useResourcesStore } from '@/stores/globalPinias/resources';
import { useTooltipsStore } from '@/stores/misc/tooltips';
import { useBuildingsStore } from '@/stores/globalPinias/buildings';
import { useExpansionsStore } from '@/stores/globalPinias/expansions';

const resources = useResourcesStore();
const tooltips = useTooltipsStore();
const buildings = useBuildingsStore();
const expansions = useExpansionsStore();
</script>

<template>

    <div :style="`top:${tooltips.getCurrentPos.top}px;left:${tooltips.getCurrentPos.left}px;`">
        <!--Non-warning-->
        <div v-if=" tooltips.getCurrentData && tooltips.getCurrentData.type == 'reg'">
            <b class="mb-2" v-if="tooltips.getCurrentData.name">
                {{tooltips.getCurrentData.name}}
            </b>
            <p class="mb-2" v-if="tooltips.getCurrentData.desc">
                {{tooltips.getCurrentData.desc}}
            </p>
            <div v-if="tooltips.getCurrentData.effectDesc" class="mb-2">
                {{ tooltips.getCurrentData.effectDesc }}
            </div>
            <div v-if="tooltips.getCurrentData.buildingId">
                <div v-if="!buildings.getOwned(tooltips.getCurrentData.buildingId) || !(buildings.getOwned(tooltips.getCurrentData.buildingId) == buildings.getLimit(tooltips.getCurrentData.buildingId))" class="mb-2">
                    <ul>
                        <li v-for="value, key in buildings.getCosts(tooltips.getCurrentData.buildingId)" :class="resources.checkIfCanAfford({[key]: value}) ? '' : 'redCost'">
                            {{ resources.getName(key) }}: {{ value }}
                        </li>
                    </ul>
                </div>
                <div v-if="buildings.getOwned(tooltips.getCurrentData.buildingId)">
                    Owned -  {{buildings.getOwned(tooltips.getCurrentData.buildingId)}}  /  {{buildings.getLimit(tooltips.getCurrentData.buildingId)}}
                </div>
            </div>
            <div v-else-if="tooltips.getCurrentData.expansionId">
                <div v-if="!expansions.checkIfBuilt(tooltips.getCurrentData.expansionId)" class="mb-2">
                    <ul>
                        <li v-for="value, key in expansions.getCosts(tooltips.getCurrentData.expansionId)" :class="resources.checkIfCanAfford({[key]: value}) ? '' : 'redCost'">
                            {{ resources.getName(key) }}: {{ value }}
                        </li>
                    </ul>
                </div>
                <div v-if="expansions.checkIfBuilt(tooltips.getCurrentData.expansionId)">
                    Unlocked!
                </div>
            </div>
        </div>
        <!--Warning-->
        <div v-else-if="tooltips.getCurrentData && tooltips.getCurrentData.type == 'warn'">
            <div v-for="i in tooltips.getCurrentData.array">
                {{ i }}
            </div>
        </div>
        <!--Modifiers
        <div v-else-if="tooltipType == 'modifier'">
            <span v-for="value, key in modifierObj">
                <div v-if="!Array.isArray(value)">
                    {{ key }}: +{{ value * 100 }}%
                </div>
                <span v-else-if="value.length > 0">
                    <div>{{ key }}</div>
                    <div v-for="j in value">{{ j }}</div>
                </span>
            </span>
        </div>-->
    </div>
</template>