<script setup>
import { reactive } from 'vue';

import { useHRStore } from '@/stores/HR';
import { useCultistsStore } from "@/stores/cultists";
import { useMiscStore } from '@/stores/misc';
import { useInventoryStore } from '@/stores/inventory';

const cultists = useCultistsStore();
const misc = useMiscStore();
const HR = useHRStore();
const inventory = useInventoryStore();

var activeCultist = reactive({cultist: null});
var equipmentScreen = reactive({check: false, type: null});

function setNewActiveCultist(cultist) {
    activeCultist.cultist = cultist;
    equipmentScreen.check = false;
}

function equipButtonClick(e) {
    equipmentScreen.check = true;
    equipmentScreen.type = e.target.value;
}

function closeButtonClick() {
    equipmentScreen.check = false;
}

function confirmButtonClick() {

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
            <!--Inventory screen - appears when selecting new item for cultist to equip-->
            <div v-if="activeCultist.cultist && equipmentScreen.check">
                <div>Equipment: {{ equipmentScreen.type }}</div>
                <div>Click to select. Double Click to immediately equip.</div>
                <div class="container">
                    <span v-for="i in inventory.getItemByType(equipmentScreen.type)">
                        <div>
                            <button class="button is-dark" :value="i.getId()">{{ i.shortName ? i.shortName : i.name }}</button>
                        </div>
                    </span>
                    <div>
                        <button class="button is-outlined" @click="closeButtonClick">Close</button>
                        <button class="button is-dark">Confirm</button>
                    </div>

                </div>
            </div>
            <!--Cultist screen - appears when a cultist is selected-->
            <div v-else-if="activeCultist.cultist">
                <div class="title is-5 mb-1 segment-title">{{ activeCultist.cultist.getName() }}</div>
                <div>{{ activeCultist.cultist.getSpecies() }}</div>
                <div>{{activeCultist.cultist.getJob() ? activeCultist.cultist.getJob() : "Unemployed"}}</div>
                <div>Level {{ activeCultist.cultist.getLevel() }} / {{ activeCultist.cultist.getLevelLimit() }}</div>
                <div>{{ activeCultist.cultist.getXp() }} / {{ activeCultist.cultist.getXpNeeded() }}</div>
                <div>
                    <div v-for="value, key in activeCultist.cultist.getEquipment()">
                        {{key}}:
                        <button v-if="value" class="button is-info" @click="equipButtonClick" :value="key">{{ value }}</button>
                        <button v-else class="button is-outlined" @click="equipButtonClick" :value="key">Empty</button>
                    </div>
                </div>
            </div>
            <!--default screen - appears if nothing else-->
            <div v-else>Select a cultist!</div>
        </div>
    </div>

</template>