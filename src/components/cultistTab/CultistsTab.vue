<script setup>
import { useCultistsStore } from "@/stores/cultists";
import { useMiscStore } from '@/stores/misc';

const cultists = useCultistsStore();
const misc = useMiscStore();
</script>

<template>
    <div class="title is-4 mb-1 segment-title">Cultists</div>
    <div class="container">
        <span v-for="i in cultists.regularCultists">
            <button v-if="i.getFreeStatPoints() != 0"  class="button is-dark is-info" @click="setNewActiveCultist(i)">{{i.getName()}}</button>
            <button v-else class="button is-outlined" @click="setNewActiveCultist(i)">{{i.getName()}}</button>
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
                    <div v-if="activeCultist.getFreeStatPoints() != 0" class="has-text-info">{{activeCultist.getFreeStatPoints()}} Skill Points Available!</div>
                    <table class="table is-striped is-narrow is-inline">
                        <thead>
                            <tr>
                                <th>Stats</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>Strength</td>
                                <td>{{ activeCultist.getStat("str") }}</td>
                                <td v-if="activeCultist.getFreeStatPoints() != 0"><button @click="addStr">+</button></td>
                            </tr>
                            <tr>
                                <td>Intelligence</td>
                                <td>{{ activeCultist.getStat("int") }}</td>
                                <td v-if="activeCultist.getFreeStatPoints() != 0"><button @click="addInt">+</button></td>
                            </tr>
                            <tr>
                                <td>Aglility</td>
                                <td>{{ activeCultist.getStat("agi") }}</td>
                                <td v-if="activeCultist.getFreeStatPoints() != 0"><button @click="addAgi">+</button></td>
                            </tr>
                            <tr>
                                <td>Charisma</td>
                                <td>{{ activeCultist.getStat("cha") }}</td>
                                <td v-if="activeCultist.getFreeStatPoints() != 0"><button @click="addCha">+</button></td>
                            </tr>
                        </tbody>
                    </table>
                </body>
                <footer class="modal-card-foot">
                    <button
                            type="button"
                            class="button is-danger"
                            @click="fireCultistBtn">Fire Cultist</button>
                    </footer>
            </div>
        
        </b-modal>
    </section>
</template>

<script>
import { fireCultist } from "@/functions";

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
        },
        addStr() {
            this.activeCultist.increaseStat("str");
        },
        addAgi() {
            this.activeCultist.increaseStat("agi");
        },
        addInt() {
            this.activeCultist.increaseStat("int");
        },
        addCha() {
            this.activeCultist.increaseStat("cha");
        },
        fireCultistBtn() {
            fireCultist(this.activeCultist.getId());
            this.isCultistModalActive = false;
        }
    }
}

</script>