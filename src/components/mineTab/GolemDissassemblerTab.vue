<script setup>
import { reactive } from 'vue';

import ActionList from '../ActionList.vue';

import { useGolemDissassemblerStore } from '@/stores/golemDissassembler';
import { useCultistsStore } from '@/stores/globalPinias/cultists';

import { addCultistToJob, removeCultistFromJob } from '@/functions';

const golemDissassembler = useGolemDissassemblerStore();
const cultists = useCultistsStore();

var golemDissassemblerTab = reactive({dissassemblerToAdd: null, golemToDissassemble: null, partToRetrieve: null});

function assignDissassembler() {
    addCultistToJob(golemDissassembler, "dissassembler", golemDissassemblerTab.dissassemblerToAdd);

    golemDissassemblerTab.dissassemblerToAdd = null;
}

function removeDissassembler(e) {
    removeCultistFromJob(golemDissassembler, "dissassembler", e.target.value);
}

function setPart(part) {
    golemDissassemblerTab.partToRetrieve = part;
}

function dissassembleGolem() {
    golemDissassembler.addDissassembly({
        golem: golemDissassemblerTab.golemToDissassemble,
        part: golemDissassemblerTab.partToRetrieve
    });

    const golem = cultists.getCultistById(golemDissassemblerTab.golemToDissassemble);

    golem.setMisc("toDissassemble", true);

    golemDissassemblerTab.golemToDissassemble = null;
    golemDissassemblerTab.partToRetrieve = null;
}
</script>


<template>
    
    <div>
        <ActionList :pinia-object="golemDissassembler"/>
    </div>
    <!--Dissassemblers-->
    <div class="title is-5 mb-1 segment-title">Dissassemblers - {{ golemDissassembler.getJobArray("dissassembler").length }} / {{ golemDissassembler.getJobLimit("dissassembler") }}</div>
    <b-field label="Assign Dissassembler">
        <b-select placeholder="Cultist" :disabled="!cultists.checkUnemployed() || !golemDissassembler.checkIfJobHasSpace('dissassembler')" v-model="golemDissassemblerTab.dissassemblerToAdd">
            <option v-for="i in cultists.getUnemployed" :value="i.getId()">{{ i.getName() }}</option>
        </b-select>
    </b-field>
    <button v-if="golemDissassemblerTab.dissassemblerToAdd != null" class="button is-dark" @click="assignDissassembler">Assign</button>
    <div v-if="golemDissassembler.getJobArray('dissassembler').length < 1">
        You will not be able to dissassemble Golems without at least one dissassembler!
    </div>
    <div>
        <div v-for="i in golemDissassembler.getJobArray('dissassembler')">
            <div class="inline-blockContainer">
                <div>
                    {{ cultists.getCultistById(i).getName() }} - Lvl {{ cultists.getCultistById(i).getLevel() }}
                </div>
                <button class="button is-small is-danger" :value="cultists.getCultistById(i).getId()" @click="removeDissassembler">Remove</button>
            </div>
        </div>
    </div>
    <!--Dissassembling-->
    <div class="title is-5 mb-1 segment-title">Golem Dissassembly</div>
    <b-field label="Dissassemble Golem">
        <b-select placeholder="Metal" v-model="golemDissassemblerTab.golemToDissassemble" :disabled="golemDissassembler.getGolemsAvailable().length < 1">
            <option v-for="i in golemDissassembler.getGolemsAvailable()" :value="i.getId()">{{ i.getName() }}</option>
        </b-select>
    </b-field>
    <div v-if="golemDissassemblerTab.golemToDissassemble">
        <div>You can only retrieve one part from each dissassembled golem.</div>
        <div>Select part:</div>
        <button :class="golemDissassemblerTab.partToRetrieve == 'arm' ? 'button is-info' : 'button is-dark'" @click="setPart('arm')">Arm</button>
        <br>
        <button :class="golemDissassemblerTab.partToRetrieve == 'chassis' ? 'button is-info' : 'button is-dark'" @click="setPart('chassis')">Chassis</button>
        <br>
        <button :class="golemDissassemblerTab.partToRetrieve == 'heart' ? 'button is-info' : 'button is-dark'" @click="setPart('heart')">Heart</button>
        <br>
        <br>
        <button class="button is-dark" @click="dissassembleGolem" :disabled="!golemDissassemblerTab.partToRetrieve">Create!</button>
    </div>
    <div v-if="golemDissassembler.getDissassemblyQueue.length > 0">
        <div>Currently Summoning: {{ golemDissassembler.getCurrentDissassembly }}</div>
        <div>Current Progress: {{ golemDissassembler.getCurrentDissassemblyPercentage }}%</div>
        <div>
            Queue:
        </div>
        <div v-for="i in golemDissassembler.getDissassemblyQueue">
            {{i}}
        </div>
    </div>

</template>