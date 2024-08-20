<script setup>
import { useHRStore } from '@/stores/HR';
import { useCultistsStore } from "@/stores/cultists";
import { useMiscStore } from '@/stores/misc';

const cultists = useCultistsStore();
const misc = useMiscStore();
const HR = useHRStore();
</script>



<template>

    <div>
        <span v-for="action in HR.getActions">
            <button v-if="action.showCondition()" :disabled="!action.condition()" @click="action.effect()"  class="button is-dark mb-1 mr-2">{{ action.name }}</button>
        </span>
    </div> 

    <div class="title is-4 mb-1 segment-title">Cultists</div>
    <div class="container">
        <span v-for="i in cultists.regularCultists">
            <button  class="button is-dark is-info" @click="setNewActiveCultist(i)">{{i.getName()}}</button>
        </span>
        <span v-for="i in misc.getCultistLimit - cultists.numOfCultists">
            <div class="button is-outlined" disabled>Empty</div>
        </span>
    </div>

    <section>
        <b-modal
            v-model="isCultistModalActive"
            has-modal-card
            trap-focus
            :destroy-on-hide="false"
            aria-role="dialog"
            aria-label="cultistModal"
            close-button-aria-label="Close"
            ariaModal>
            <div class="modal-card">
                <header class="modal-card-head">
                    <p class="modal-card-title">{{activeCultist.getName()}}</p>
                    <button
                            type="button"
                            class="delete"
                            @click="isCultistModalActive = false"></button>
                </header>
                <body class="modal-card-body">
                    <div>{{ activeCultist.getSpecies() }}</div>
                    <div>{{ activeCultist.getJob() ? activeCultist.getJob() : "Unemployed" }}</div>
                    <div>Level {{ activeCultist.getLevel() }} / {{activeCultist.getLevelLimit()}}</div>
                    <div>{{ activeCultist.getXp() }} / {{ activeCultist.getXpNeeded() }}XP</div>
                    <br>
                    <div>
                        <div>Equipment</div>
                        <div>{{ activeCultist.getEquipment() }}</div>
                    </div>
                </body>
                <footer class="modal-card-foot">
                    <button
                            type="button"
                            class="button is-danger"
                            @click="fireCultistBtn()">Remove Cultist</button>
                    </footer>
            </div>
        
        </b-modal>
    </section>

</template>

<script>
//go do this through the optionsAPI cause buefy doesn't like composition
export default {
    data() {
        return {
            isCultistModalActive: false,
            activeCultist: {}
        }
    },
    methods: {
        setNewActiveCultist(cultist) {
            this.activeCultist = cultist;
            this.isCultistModalActive = true;
        }/*
        fireCultistBtn() {
            fireCultist(this.activeCultist.getId());
            this.isCultistModalActive = false;
        }*/
    }
}
</script>