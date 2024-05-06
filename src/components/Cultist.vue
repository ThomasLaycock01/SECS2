<script setup>
import { toRefs } from 'vue';

import { useCultistsStore } from '@/stores/cultists';

const cultists = useCultistsStore();

const props = defineProps({
    cultistId: Number
})

const {cultistId} = toRefs(props);

const cultist = cultists.getCultistById(cultistId.value)

function addStr() {
    cultist.increaseStat("str");
}

function addInt() {
    cultist.increaseStat("int");
}
function addAgi() {
    cultist.increaseStat("agi");
}
function addCha() {
    cultist.increaseStat("cha");
}
</script>

<template>
    <div class="mb-1 p-1 cultist-box">
        <div class="is-flex is-justify-content-space-between">
            <div class="title is-4 no-bottom-margin">{{cultist.getName()}}</div>
        <button class="button is-danger is-small">X</button>
        </div>
        <div class="is-flex is-justify-content-space-between  is-align-items-space-around">
            <div v-if="cultist.getFreeStatPoints() != 0">{{cultist.getFreeStatPoints()}} Skill Points Available</div>
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
                        <td>{{ cultist.getStat("str") }}</td>
                        <td v-if="cultist.getFreeStatPoints() != 0"><button @click="addStr">+</button></td>
                    </tr>
                    <tr>
                        <td>Intelligence</td>
                        <td>{{ cultist.getStat("int") }}</td>
                        <td v-if="cultist.getFreeStatPoints() != 0"><button @click="addInt">+</button></td>
                    </tr>
                    <tr>
                        <td>Aglility</td>
                        <td>{{ cultist.getStat("agi") }}</td>
                        <td v-if="cultist.getFreeStatPoints() != 0"><button @click="addAgi">+</button></td>
                    </tr>
                    <tr>
                        <td>Charisma</td>
                        <td>{{ cultist.getStat("cha") }}</td>
                        <td v-if="cultist.getFreeStatPoints() != 0"><button @click="addCha">+</button></td>
                    </tr>
                </tbody>
            </table>
            <div class="is-inline">
                <div>Level {{ cultist.getLevel() }}</div>
                <div>{{ cultist.getXp() }} / {{ cultist.getXpNeeded() }}XP</div>
                <div>{{ cultist.getJob() ? cultist.getJob() : "Unemployed" }}</div>
            </div>
        </div>
    </div>
</template>