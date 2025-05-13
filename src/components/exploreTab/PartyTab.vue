<script setup>
import { mouseoverAutoHealTooltip, mouseoverHealTooltip } from '@/functions';

import { usePartiesStore } from '@/stores/barracks/parties';
import { useModalsStore } from '@/stores/misc/modal';
import { useTooltipsStore } from '@/stores/misc/tooltips';
import { useResourcesStore } from '@/stores/globalPinias/resources';
import { useProgressionStore } from '@/stores/misc/progression';

const parties = usePartiesStore();
const modals = useModalsStore();
const tooltips = useTooltipsStore();
const resources = useResourcesStore();
const progression = useProgressionStore();

function instaHealClick(partyObj) {
    resources.removeResources({grain:partyObj.getGrainHealCost()});

    partyObj.instaHealCultists();
}

function instaHealCheck(partyObj) {
    if (partyObj.getGrainHealCost() == 0) {
        return false;
    }
    if (!resources.checkIfCanAfford({grain: partyObj.getGrainHealCost()})) {
        return false;
    }

    return true;
}
</script>


<template>

    <div>
        <div class="title is-5 mb-1 segment-title">Parties</div>
        <button class="button is-dark" @click="modals.openParty()">Create Party</button>
        <br>
        <br>
        <div v-if="Object.keys(parties.getParties).length > 0">
            <div v-for="i in parties.getParties">
                {{ i.getName() }} - {{ i.getPartySize() }}/{{ i.getLimit() }} - Currently {{ i.getCurrentActivity() ? i.getCurrentActivity() : "doing nothing" }}
                <button class="button is-dark" @click="modals.openParty(i)" :disabled="i.getCurrentActivity()">Edit</button>
                <span v-if="progression.checkUnlocked('completedAbandonedFarmhouse')">
                    <button class="button is-dark" @click="instaHealClick(i)" @mouseover="mouseoverHealTooltip($event, i)" @mouseleave="tooltips.hideTooltip()" :disabled="!instaHealCheck(i)">Insta-heal</button>
                </span>
                <span v-if="progression.checkUnlocked('completedBanditHideout')">
                    <button class="button" :class="i.getAutoHeal() ? 'is-success' : 'is-danger'" @click="i.toggleAutoHeal()" @mouseover="mouseoverAutoHealTooltip($event, i)" @mouseleave="tooltips.hideTooltip()">Auto Insta-heal</button>
                </span>
                <br>
                <br>
            </div>
        </div>
        <div v-else>
            No parties
        </div>
    </div>

</template>