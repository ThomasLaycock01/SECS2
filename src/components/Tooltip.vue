<script setup>
import { useResourcesStore } from '@/stores/globalPinias/resources';

const resources = useResourcesStore();

const props = defineProps({
    tooltipType: String,
    tooltipObj: Object,
    warningObj: Array
})
</script>

<template>

    <div>
        <!--Non-warning-->
        <div v-if="props.tooltipType != 'warning'">
            <b class="mb-2">
                {{props.tooltipObj.name}}
            </b>
            <p class="mb-2">
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
                Owned -  {{props.owned()}}  /  {{props.limit()}}
            </div>
        </div>
        <!--Warning-->
        <div v-else>
            <div v-for="i in props.warningObj">
                {{ i }}
            </div>
        </div>
    </div>
</template>