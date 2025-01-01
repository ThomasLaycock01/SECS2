<script setup>
import { useModalsStore } from '@/stores/misc/modal';

const modals = useModalsStore();
</script>


<template>

    <div class="modalBackdrop" @click="modals.toggleModal('assignment')"></div>

    <div class="cssModal">
        <div>
            <p>Some text in the Modal..</p>
        </div>
    </div>


</template>