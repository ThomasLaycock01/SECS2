<script setup>
import { reactive } from 'vue';

import { useModalsStore } from '@/stores/misc/modal';

const modals = useModalsStore();
</script>


<template>

    <div class="modalBackdrop" @click="modals.closeParty()"></div>

    <div class="generalModal">
        <div class="modalHeader">
            <p>Party</p>
        </div>

        <div class="modalBody">
            <div class="columns">
                <div class="column is-half">
                </div>
                <div class="column is-half">
                </div>
            </div>
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