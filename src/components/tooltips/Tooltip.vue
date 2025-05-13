<script setup>
import BuildingTooltip from './BuildingTooltip.vue';
import ExpansionTooltip from './ExpansionTooltip.vue';
import HealTooltip from './HealTooltip.vue';
import ItemTooltip from './ItemTooltip.vue';
import RecruitTooltip from './RecruitTooltip.vue';

import { useTooltipsStore } from '@/stores/misc/tooltips';

const tooltips = useTooltipsStore();
</script>

<template>

    <div :style="`top:${tooltips.getCurrentPos.top}px;left:${tooltips.getCurrentPos.left}px;`">
        <div v-if="tooltips.getCurrentData">
            <!--Non-warning-->
            <div v-if="tooltips.getCurrentData.type == 'reg'">
                <b v-if="tooltips.getCurrentData.name" class="mb-2">
                    {{tooltips.getCurrentData.name}}
                </b>
                <p v-if="tooltips.getCurrentData.desc" class="mb-2">
                    {{tooltips.getCurrentData.desc}}
                </p>
                <p v-if="tooltips.getCurrentData.effectDesc" class="mb-2">
                    {{ tooltips.getCurrentData.effectDesc }}
                </p>
                <!--Recruitment-->
                <div v-if="tooltips.getCurrentData.raceId">
                    <RecruitTooltip :raceId="tooltips.getCurrentData.raceId"/>
                </div>
                <!--Buildings-->
                <div v-if="tooltips.getCurrentData.buildingId">
                    <BuildingTooltip :buildingId="tooltips.getCurrentData.buildingId"/>
                </div>
                <!--Expansions-->
                <div v-else-if="tooltips.getCurrentData.expansionId">
                    <ExpansionTooltip :expansionId="tooltips.getCurrentData.expansionId"/>
                </div>
                <!--Healing-->
                <div v-else-if="tooltips.getCurrentData.healCost">
                    <HealTooltip :healCost="tooltips.getCurrentData.healCost"/>
                </div>
            </div>
            <!--Warning-->
            <div v-else-if="tooltips.getCurrentData.type == 'warn'">
                <div v-for="i in tooltips.getCurrentData.array">
                    {{ i }}
                </div>
            </div>
            <!--Item-->
            <div v-else-if="tooltips.getCurrentData.type == 'item'">
                <ItemTooltip :item="tooltips.getCurrentData.itemObj"/>
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