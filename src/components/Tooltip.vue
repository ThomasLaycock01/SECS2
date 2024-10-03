<script setup>
import { useBuildingsStore } from '@/stores/globalPinias/buildings';

const buildings = useBuildingsStore();

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
            <p class="mb-2">
            {{ props.effectDesc }}
            </p>
            <div class="mb-2">
                <ul v-for="value, key in props.costs()">
                    <li>{{ key }} : {{ value }}</li>
                </ul>
            </div>
            <p class="mb-2">
                Owned - {{ props.owned() }}
            </p>
        </span>
        <!--Expansions-->
        <span v-if="props.tooltipType=='expansion'">
            <div class="mb-2">
                <ul v-for="value, key in props.costs()">
                    <li>{{ key }} : {{ value }}</li>
                </ul>
            </div>
        </span>
    </div>
</template>