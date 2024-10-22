<script setup>
import { useResourcesStore } from '@/stores/globalPinias/resources';

const resources = useResourcesStore();

const props = defineProps({
    tooltipType: String,
    name: String,
    desc: String,
    effectDesc: {
        type: String,
        default: null
    },
    owned: {
        type: Function,
        default: null
    },
    costs: {
        type: Function,
        default: null
    },
    limit: {
        type: Number,
        default: null
    }
})
</script>

<template>
    <!--templates broken up by type-->
    <div>
        <!--Name and desc are always shown-->
        <b class="mb-2">
            {{props.name}}
        </b>
        <p class="mb-2">
            {{props.desc}}
        </p>
        <!--Buildings-->
        <span v-if="props.tooltipType==`building`">
            <p class="mb-2" v-if="props.owned() < props.limit">
            {{ props.effectDesc }}
            </p>
            <div class="mb-2" v-if="props.owned() < props.limit">
                <ul v-for="value, key in props.costs()">
                    <li>{{ resources.getName(key) }} : {{ value }}</li>
                </ul>
            </div>
            <p class="mb-2">
                Owned - {{ props.owned() }} / {{ props.limit }}
            </p>
        </span>
        <!--Expansions-->
        <span v-if="props.tooltipType=='expansion'">
            <div class="mb-2">
                <ul v-for="value, key in props.costs()">
                    <li>{{ resources.getName(key) }} : {{ value }}</li>
                </ul>
            </div>
        </span>
        <!--Recruitment-->
        <span v-if="props.tooltipType=='recruitment'">
            <div class="mb-2">
                <ul v-for="value, key in props.costs()">
                    <li>{{ resources.getName(key) }} : {{ value }}</li>
                </ul>
            </div>
        </span>
    </div>
</template>