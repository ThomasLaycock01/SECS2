<script setup>
import { reactive } from 'vue';

import { useModalsStore } from '@/stores/misc/modal';

const modals = useModalsStore();

const party = modals.getPartyObj;
</script>


<template>

    <div class="modalBackdrop" @click="modals.closeParty()"></div>

    <div class="generalModal">
        <div class="modalHeader">
            <p>{{party.getName()}} - {{ party.getPartySize() }}/{{ party.getLimit() }}</p>
        </div>

        <div class="modalBody">
            
            <b-tabs v-model="activeTab">
                <!--Tab for assigning Roles-->
                <b-tab-item label="Roles">
                    <div class="columns">
                        <div class="column is-half">
                        </div>
                        <div class="column is-half">
                        </div>
                    </div>
                </b-tab-item>

                <!--Tab for assigning cultists-->
                <b-tab-item label="Cultists">

                </b-tab-item>
            </b-tabs>
        </div>

        <div class="modalFooter">
            <button class="button is-dark">Confirm</button>
            <button class="button is-danger" @click="modals.closeParty()">Cancel</button>
        </div>

    </div>


</template>

<script>

export default {
    data() {
        return {activeTab: 0}
    }
}

</script>