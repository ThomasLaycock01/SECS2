<script setup>
import { usePartiesStore } from '@/stores/barracks/parties';
import { useModalsStore } from '@/stores/misc/modal';

const parties = usePartiesStore();
const modals = useModalsStore();
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
            </div>
        </div>
        <div v-else>
            No parties
        </div>
    </div>

</template>