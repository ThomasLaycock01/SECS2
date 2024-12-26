<script setup>
import { useBarracksStore } from '@/stores/barracks/barracks';

const barracks = useBarracksStore();

function addRole(role) {
    barracks.addRole(role)

}
</script>


<template>

    <div>
        <!--Roles-->
        <div class="title is-5 mb-1 segment-title">Party - {{ barracks.getPartySize }} / {{ barracks.getPartyLimit }}</div>
        <div>
            <div v-if="barracks.checkIfPartySpace">
                <b-field label="Add Role">
                    <button class="button is-dark" @click="addRole('tank')">Tank</button>
                    <button class="button is-dark" @click="addRole('DPS')">DPS</button>
                    <button class="button is-dark" @click="addRole('healer')">Healer</button>
                </b-field>
            </div>
        </div>
        <!--Cultists-->
        <br/>
        <div>
            <div v-for="i in barracks.getParty">
                <div>{{ i.role }}: 
                    <span v-if="i.cultist">{{ i.cultist }}</span>
                    <span v-else>Empty</span>
                </div>
                <button class="button is-dark">Assign</button>
            </div>
            <br>
        </div>
    </div>

</template>