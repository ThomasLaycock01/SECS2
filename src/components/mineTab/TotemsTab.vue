<script setup>
import { reactive } from 'vue';

import ActionList from '../ActionList.vue';

import { useTotemsStore } from '@/stores/mines/totems';

import { useCultistsStore } from '@/stores/globalPinias/cultists';

import { addCultistToJob, removeCultistFromJob } from '@/functions';

const totems = useTotemsStore();
const cultists = useCultistsStore();

var totemsTab = reactive({caretakerToAssign: null});

function assignCaretaker() {
    addCultistToJob(totems, "caretaker", totemsTab.caretakerToAssign);

    totemsTab.caretakerToAssign = null;
}

function removeCaretaker(e) {
    removeCultistFromJob(totems, "caretaker", e.target.value);
}

function upgradeTotem(totemId) {
    totems.upgradeTotem(totemId);
}
</script>

<template>
    <div>
        <ActionList :pinia-object="totems"/>
    </div>

    <!--Caretaker-->
    <div class="title is-5 mb-1 segment-title">Caretakers - {{ totems.getJobArray("caretaker").length }} / {{ totems.getJobLimit("caretaker") }}</div>
    <b-field label="Assign Caretaker">
        <b-select placeholder="Cultist" :disabled="!cultists.checkUnemployed || !totems.checkIfJobHasSpace('caretaker')" v-model="totemsTab.caretakerToAssign">
            <option v-for="i in cultists.getUnemployed" :value="i.getId()">{{ i.getName() }}</option>
        </b-select>
    </b-field>
    <button v-if="totemsTab.caretakerToAssign != null" class="button is-dark" @click="assignCaretaker">Assign</button>
    <div v-if="totems.getJobArray('caretaker').length < 1">
        Totems will decay over time! Assign a caretaker to maintain them!
    </div>
    <div>
        <div v-for="i in totems.getJobArray('caretaker')">
            <div class="inline-blockContainer">
                <div>
                    {{ cultists.getCultistById(i).getName() }} - Lvl {{ cultists.getCultistById(i).getLevel() }}
                </div>
                <button class="button is-small is-danger" :value="cultists.getCultistById(i).getId()" @click="removeCaretaker">Remove</button>
            </div>
        </div>
    </div>
    <br>
    <!--Totems-->
    <div class="title is-5 mb-1 segment-title">Totems</div>
    <div>
        <div v-for="i in totems.getTotems">
            <div class="title is-6">{{ i.name }}</div>
            <div>Level {{ i.level }}/{{ i.maxLevel }}</div>
            <div>{{ i.effectDesc }}</div>
            <div>Upgrade costs:</div>
            <ul>
                <li v-for="value, key in totems.getTotemCost(i.id)">{{ value }} {{ key }}</li>
            </ul>
            <button class="button is-small is-dark" :disabled="!totems.checkIfTotemUpgradeAvailable(i.id)" @click="upgradeTotem(i.id)">Upgrade</button>
        </div>
    </div>

</template>