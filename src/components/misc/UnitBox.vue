<script setup>
import Tooltip from '../Tooltip.vue';

import { useTooltipsStore } from '@/stores/misc/tooltips';
import { useProgressionStore } from '@/stores/misc/progression';
import { useResourcesStore } from '@/stores/globalPinias/resources';

const props = defineProps({
    unit: Object,
    type: String
})

const unit = props.unit;

const tooltips = useTooltipsStore();
const progression = useProgressionStore();
const resources = useResourcesStore();

function instaHealClick(cultistObj) {
    const costObj = {grain:cultistObj.getGrainHealCost()}
    if (resources.checkIfCanAfford(costObj)) {
        resources.removeResources(costObj);

        cultistObj.instaHeal();
    }
}
</script>


<template>

<div class="unitBox">
    <div v-if="props.type == 'empty'">
        <div class="centered">Empty slot</div>
    </div>
    <div v-else>
        <div v-if="props.type == 'cultist'">{{ unit.getName() }} - {{ unit.getRole().getName() }}</div>
        <div v-else>{{ unit.getName() }}</div>
        <div>
            <table class="table is-bordered is-narrow" v-if="props.type != 'cultist' || !unit.getKnockedOut()">
                <tbody>
                    <tr v-if="props.type == 'cultist'">
                        <th>{{ unit.getCurrentHP() }}/{{ unit.getStat("HP") }} HP</th>
                        <th v-if="progression.checkUnlocked('completedAbandonedFarmhouse')" class="healBtn" @mouseover="tooltips.setActiveTooltip(`instaHeal${unit.getId()}`)" @mouseleave="tooltips.removeActiveTooltip()" @click="instaHealClick(unit)" :disabled="!resources.checkIfCanAfford({grain:unit.getGrainHealCost()}) || unit.getGrainHealCost() < 1">Heal</th>
                        <span v-if="tooltips.getActiveTooltip == `instaHeal${unit.getId()}`">
                                <Tooltip class="tooltip" :tooltipObj="tooltips.getInstaHealTooltip(unit)"/>
                        </span>
                    </tr>
                    <tr v-else>
                        <th>{{ unit.getCurrentHP() }}/{{ unit.getStat("HP") }} HP</th>
                        <th></th>
                    </tr>
                    <tr>
                        <td>{{ Math.round(unit.getAtkValue("phys") * 100) / 100 }} P-Atk</td>
                        <td>{{ Math.round(unit.getAtkValue("mag") * 100) / 100 }} M-Atk</td>
                    </tr>
                    <tr>
                        <td>{{ Math.round(unit.getDefValue("phys") * 100) / 100 }} P-Def</td>
                        <td>{{ Math.round(unit.getDefValue("mag") * 100) / 100 }} M-Def</td>
                    </tr>
                </tbody>
            </table>
            <div v-else>Knocked out! {{ Math.floor(unit.getKnockOutTime() / 60) }} Mins {{ unit.getKnockOutTime() % 60 }} secs left</div>
        </div>
    </div>
</div>

</template>