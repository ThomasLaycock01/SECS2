<script setup>
import { reactive } from 'vue';

import { useHRStore } from '@/stores/HR';
import { useCultistsStore } from "@/stores/cultists";
import { useMiscStore } from '@/stores/misc';

const cultists = useCultistsStore();
const misc = useMiscStore();
const HR = useHRStore();

var activeCultist = reactive({cultist: null});

function setNewActiveCultist(cultist) {
    activeCultist.cultist = cultist;
}
</script>



<template>

    <div>
        <span v-for="action in HR.getActions">
            <button v-if="action.showCondition()" :disabled="!action.condition()" @click="action.effect()"  class="button is-dark mb-1 mr-2">{{ action.name }}</button>
        </span>
    </div> 

    <div class="title is-4 mb-1 segment-title">Cultists</div>
    <div>

    </div>
    <div class="columns">
        <div class="column is-half">
            <div class="container">
                <span v-for="i in cultists.regularCultists">
                    <button  class="button is-dark is-info" @click="setNewActiveCultist(i)">{{i.getName()}}</button>
                </span>
                <span v-for="i in misc.getCultistLimit - cultists.numOfCultists">
                    <div class="button is-outlined" disabled>Empty</div>
                </span>
            </div>
        </div>
        <div class="column is-half">
            <div v-if="activeCultist.cultist">
                <div class="title is-5 mb-1 segment-title">{{ activeCultist.cultist.getName() }}</div>
                <div>{{ activeCultist.cultist.getSpecies() }}</div>
                <div>{{activeCultist.cultist.getJob() ? activeCultist.cultist.getJob() : "Unemployed"}}</div>
                <div>Level {{ activeCultist.cultist.getLevel() }} / {{ activeCultist.cultist.getLevelLimit() }}</div>
                <div>{{ activeCultist.cultist.getXp() }} / {{ activeCultist.cultist.getXpNeeded() }}</div>
            </div>
            <div v-else>Select a cultist!</div>
        </div>
    </div>

    <!--<section>
        <div>

        </div>
        <!--<b-modal
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
    </section>-->

</template>