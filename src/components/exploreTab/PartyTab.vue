<script setup>
import Tooltip from '../Tooltip.vue';

import { usePartiesStore } from '@/stores/barracks/parties';
import { useModalsStore } from '@/stores/misc/modal';
import { useTooltipsStore } from '@/stores/misc/tooltips';
import { useResourcesStore } from '@/stores/globalPinias/resources';

const parties = usePartiesStore();
const modals = useModalsStore();
const tooltips = useTooltipsStore();
const resources = useResourcesStore();

function instaHealClick(partyObj) {
    const resources = useResourcesStore();

    resources.removeResources({grain:partyObj.getGrainHealCost()});

    partyObj.instaHealCultists();
}

function instaHealCheck(partyObj) {
    const resources = useResourcesStore();

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
                <button class="button" :class="i.getIsHealing() ? 'is-danger' : 'is-info'" :disabled="i.getCurrentActivity() && i.getCurrentActivity() != 'Healing'" @click=i.toggleIsHealing()>{{i.getIsHealing() ? 'Stop' : 'Heal'}}</button>
                <span>
                    <button class="button is-dark" @click="instaHealClick(i)" @mouseover="tooltips.setActiveTooltip(`instaHeal${i.getId()}`)" @mouseleave="tooltips.removeActiveTooltip()" :disabled="!instaHealCheck(i)">Insta-heal</button>
                    <span v-if="tooltips.getActiveTooltip == `instaHeal${i.getId()}`">
                        <Tooltip class="tooltip" tooltipType="regular" :tooltipObj="tooltips.getInstaHealTooltip(i)"/>
                    </span>
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