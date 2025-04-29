<script setup>
import { useResourcesStore } from '@/stores/globalPinias/resources';
import { useTooltipsStore } from '@/stores/misc/tooltips';

const resources = useResourcesStore();

const props = defineProps({
    tooltipType: {
        type: String,
        default: 'regular'
    },
    tooltipObj: Object,
    warningObj: Array,
    modifierObj: Object
})

const tooltips = useTooltipsStore();
</script>

<template>

    <div ref="tooltip" :style="`top:${tooltips.getCurrentPos.top}px;left:${tooltips.getCurrentPos.left}px;`">
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
            <div v-if="tooltips.getCurrentData.costs && (!tooltips.getCurrentData.owned || !(tooltips.getCurrentData.owned() == tooltips.getCurrentData.limit()))" class="mb-2">
                <ul>
                    <li v-for="value, key in tooltips.getCurrentData.costs()" :class="resources.checkIfCanAfford({[key]: value}) ? '' : 'redCost'">
                        {{ resources.getName(key) }}: {{ value }}
                    </li>
                </ul>
            </div>
            <div v-if="tooltips.getCurrentData.owned">
                Owned -  {{tooltips.getCurrentData.owned()}}  /  {{tooltips.getCurrentData.limit()}}
            </div>
        </div>
        <!--Warning-->
        <div v-else-if="tooltipType == 'warning'">
            <div v-for="i in warningObj">
                {{ i }}
            </div>
        </div>
        <!--Modifiers-->
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
        </div>
    </div>
</template>