<script setup>
import { useResourcesStore } from '@/stores/globalPinias/resources';

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
</script>

<template>

    <div>
        <!--Non-warning-->
        <div v-if="props.tooltipType == 'regular'">
            <b class="mb-2" v-if="props.tooltipObj.name">
                {{props.tooltipObj.name}}
            </b>
            <p class="mb-2" v-if="props.tooltipObj.tier">
                Tier {{ props.tooltipObj.tier }}
            </p>
            <p class="mb-2" v-if="props.tooltipObj.desc">
                {{props.tooltipObj.desc}}
            </p>
            <div v-if="props.tooltipObj.effectDesc" class="mb-2">
                {{ props.tooltipObj.effectDesc }}
            </div>
            <div v-if="props.tooltipObj.costs" class="mb-2">
                <ul>
                    <li v-for="value, key in props.tooltipObj.costs()" :class="resources.checkIfCanAfford({[key]: value}) ? '' : 'redCost'">
                        {{ resources.getName(key) }}: {{ value }}
                    </li>
                </ul>
            </div>
            <div v-if="props.tooltipObj.owned">
                Owned -  {{props.tooltipObj.owned()}}  /  {{props.tooltipObj.limit()}}
            </div>
        </div>
        <!--Warning-->
        <div v-else-if="props.tooltipType == 'warning'">
            <div v-for="i in props.warningObj">
                {{ i }}
            </div>
        </div>
        <!--Modifiers-->
        <div v-else-if="props.tooltipType == 'modifier'">
            <span v-for="value, key in props.modifierObj">
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