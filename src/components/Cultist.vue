<script setup>
import { toRefs } from 'vue';

import { useCultistsStore } from '@/stores/cultists';

const cultists = useCultistsStore();

const props = defineProps({
    cultistId: Number
})

const {cultistId} = toRefs(props);

const cultist = cultists.getCultistById(cultistId.value)
</script>

<template>
    <div class="mb-1 p-1 cultist-box">
        <div class="is-flex is-justify-content-space-between">
            <div class="title is-4 no-bottom-margin">{{cultist.getName()}}</div>
        <button class="button is-danger is-small">X</button>
        </div>
        <div class="is-flex is-justify-content-space-between  is-align-items-space-around">
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
                    </tr>
                    <tr>
                        <td>Intelligence</td>
                        <td>{{ cultist.getStat("int") }}</td>
                    </tr>
                    <tr>
                        <td>Aglility</td>
                        <td>{{ cultist.getStat("agi") }}</td>
                    </tr>
                    <tr>
                        <td>Charisma</td>
                        <td>{{ cultist.getStat("cha") }}</td>
                    </tr>
                </tbody>
            </table>
            <div class="is-inline">
                <div>{{ cultist.getJob() ? cultist.getJob() : "Unemployed" }}</div>
            </div>
        </div>
    </div>
</template>