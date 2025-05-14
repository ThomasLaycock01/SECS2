<script setup>
import { tooltip } from '@/functions';

import { useTooltipsStore } from '@/stores/misc/tooltips';
import { useProgressionStore } from '@/stores/misc/progression';
import { useResourcesStore } from '@/stores/globalPinias/resources';
import { useModalsStore } from '@/stores/misc/modal';

const props = defineProps({
    unit: Object,
    type: String
})

const unit = props.unit;

const tooltips = useTooltipsStore();
const progression = useProgressionStore();
const resources = useResourcesStore();
const modals = useModalsStore();

function instaHealClick(cultistObj) {
    const costObj = {grain:cultistObj.getGrainHealCost()}
    if (resources.checkIfCanAfford(costObj)) {
        resources.removeResources(costObj);

        cultistObj.instaHeal();
    }
}

function mouseoverInstaHeal(e, healObj) {
    const obj = {
        type: "reg",
        desc: "Spend Grain to instantly heal a Cultist",
        healCost(){return healObj.getGrainHealCost();} 
    }

    tooltip(e, obj);
}
</script>


<template>

<div class="unitBox">
    <div v-if="props.type == 'empty'">
        <div class="centered">Empty slot</div>
    </div>
    <div v-else>
        <div v-if="props.type == 'cultist'" class="inline-blockContainer">
            <div class="mr-1">{{ unit.getName() }} - {{ unit.getRole().getName() }}</div>
            <button class="button is-small" :class="unit.checkNotif() ? 'is-info' : 'is-dark'"   @click="modals.openCultist(unit)">Edit</button>
        </div>
        <div v-else>{{ unit.getName() }}</div>
        <div>
            <table class="table is-bordered is-narrow" v-if="props.type != 'cultist' || !unit.getKnockedOut()">
                <tbody>
                    <tr v-if="props.type == 'cultist'">
                        <th>{{ unit.getCurrentHP() }}/{{ unit.getStat("HP") }} HP</th>
                        <th v-if="progression.checkUnlocked('completedAbandonedFarmhouse')" class="healBtn" @mouseover="mouseoverInstaHeal($event, unit)" @mouseleave="tooltips.hideTooltip()" @click="instaHealClick(unit)" :disabled="!resources.checkIfCanAfford({grain:unit.getGrainHealCost()}) || unit.getGrainHealCost() < 1">Heal</th>
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