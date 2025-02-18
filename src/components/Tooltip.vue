<script setup>
import { useResourcesStore } from '@/stores/globalPinias/resources';

const resources = useResourcesStore();

const props = defineProps({
    tooltipType: String,
    tooltipObj: Object,
    warningObj: Array,
    effectDesc: {
        type: String,
        default: null
    },
    costs: {
        type: Function,
        default: null
    },
    owned: {
        type: Function,
        default: null
    },
    limit: {
        type: Function,
        default: null
    }
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
        <!--Buildings
        <span v-if="props.tooltipType==`building`">
            <p class="mb-2">
             {{props.effectDesc}} 
            </p>
            <div class="mb-2">
                <ul v-for="value, key in props.costs()">
                    <li>{{ resources.getName(key) }} : {{ value }}</li>
                </ul>
            </div>
            <p class="mb-2">
                Owned -  {{props.owned()}}  /  {{props.limit()}} 
            </p>
        </span>
        <!--Expansions
        <span v-if="props.tooltipType=='expansion'">
            <div class=has-text-warning>
                This is mutual exclusive with expansions of the same tier!
            </div>

            <div class="mb-2">
                <ul v-for="value, key in props.costs()">
                    <li>{{ resources.getName(key) }} : {{ value }}</li>
                </ul>
            </div>
        </span>
        <!--Recruitment
        <span v-if="props.tooltipType=='recruitment'">
            <div class="mb-2">
                <ul v-for="value, key in props.costs()">
                    <li>{{ resources.getName(key) }} : {{ value }}</li>
                </ul>
            </div>
        </span>-->
    </div>
</template>