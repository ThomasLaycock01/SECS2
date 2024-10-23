<script setup>
import ActionList from '../ActionList.vue';
import PerkTooltip from './PerkTooltip.vue';

import { reactive } from 'vue';

import { useHRStore } from '@/stores/HR';
import { useCultistsStore } from "@/stores/globalPinias/cultists";
import { useInventoryStore } from '@/stores/globalPinias/inventory';
import { useExpansionsStore } from '@/stores/expansions';

import perks from "@/assets/json/perks.json";

const cultists = useCultistsStore();
const HR = useHRStore();
const inventory = useInventoryStore();
const expansions = useExpansionsStore();

var activeCultist = reactive({cultist: null});
var equipmentScreen = reactive({check: false, type: null, selectedItem: null});
var selectedPerk = reactive({perk: null});

//for the cultist half of the screen
function setNewActiveCultist(cultist) {
    activeCultist.cultist = cultist;
    equipmentScreen.check = false;
}



//for the display half of the screen
function equipButtonClick(e) {
    equipmentScreen.check = true;
    equipmentScreen.type = e.target.value;
}


//for the equipment screen
function closeButtonClick() {
    equipmentScreen.check = false;
}

function unequipButtonClick() {
    activeCultist.cultist.unequipItem(equipmentScreen.type);

    equipmentScreen.check = false;
    equipmentScreen.type = null;
    equipmentScreen.selectedItem = null;
}

function equipmentScreenButtonClick(id) {
    equipmentScreen.selectedItem = id;
}

function confirmButtonClick() {
    const item = inventory.getItemById(equipmentScreen.selectedItem);
    activeCultist.cultist.equipItem(item);

    equipmentScreen.check = false;
    equipmentScreen.type = null;
    equipmentScreen.selectedItem = null;
}


//for the perk display
function mouseEnterPerk(e) {
    selectedPerk.perk = e.target.value
}

function mouseLeavePerk(e) {
    selectedPerk.perk = null;
}

function assignPerk(e) {
    activeCultist.cultist.addPerk(perks.default[e.target.value]);
    selectedPerk.perk = null;
}
</script>



<template>

    <div>
        <ActionList :piniaObject="HR"/>
    </div> 

    <div class="title is-4 mb-1 segment-title">Cultists</div>
    <div>

    </div>
    <div class="columns">
        <div class="column is-half">
            <div class="title is-5 mb-1 segment-title">Cultists</div>
            <div class="cultistContainer">
                <span v-for="i in cultists.getRegularCultists">
                    <button  class="button is-dark is-info cultistGridItem" @click="setNewActiveCultist(i)">{{i.getName()}}</button>
                </span>
                <span v-for="i in cultists.getRegularLimit - cultists.getNumOfRegular">
                    <div class="button is-outlined cultistGridItem" disabled>Empty</div>
                </span>
            </div>
            <div v-if="expansions.checkIfSummonAvailable">
                <div class="title is-5 mb-1 segment-title">Summons</div>
                <div class="cultistContainer">
                    <span v-for="i in cultists.getSummonedCultists">
                        <button  class="button is-dark is-info cultistGridItem" @click="setNewActiveCultist(i)">{{i.getName()}}</button>
                    </span>
                    <span v-for="i in cultists.getSummonLimit - cultists.getNumOfSummoned">
                        <div class="button is-outlined cultistGridItem" disabled>Empty</div>
                    </span>
                </div>
            </div>
        </div>
        <div class="column is-half">
            <!--Inventory screen - appears when selecting new item for cultist to equip-->
            <div v-if="activeCultist.cultist && equipmentScreen.check">
                <div>Equipment: {{ equipmentScreen.type }}</div>
                <div>Click to select.</div>
                <div class="container">
                    <span v-for="i in inventory.getUnequippedItemByType(equipmentScreen.type)">
                        <div>
                            <button :class="i.getId() == equipmentScreen.selectedItem ? 'button is-info' : 'button is-dark'" @click="equipmentScreenButtonClick(i.getId())">{{ i.shortName ? i.shortName : i.name }}</button>
                        </div>
                    </span>
                </div>
                <br/>
                <div>
                    <button class="button is-outlined" @click="closeButtonClick">Close</button>
                    <button class="button is-dark" @click="confirmButtonClick">Confirm</button>
                    <span v-if="activeCultist.cultist.checkIfEquipped(equipmentScreen.type)">
                        <button class="button is-outlined is-danger" @click="unequipButtonClick">Unequip Item</button>
                    </span>
                </div>
            </div>
            <!--Cultist screen - appears when a cultist is selected-->
            <div v-else-if="activeCultist.cultist">
                <div class="title is-5 mb-1 segment-title">{{ activeCultist.cultist.getName() }}</div>
                <div>{{ activeCultist.cultist.getRaceName() }}</div>
                <div>{{activeCultist.cultist.getJob() ? activeCultist.cultist.getJob() : "Unemployed"}}</div>
                <div>Level {{ activeCultist.cultist.getLevel() }} / {{ activeCultist.cultist.getLevelLimit() }}</div>
                <div>{{ activeCultist.cultist.getXp() }} / {{ activeCultist.cultist.getXpNeeded() }}</div>
                <br>
                <div class="title is-6">Equipment</div>
                <div>
                    <div v-for="value, key in activeCultist.cultist.getEquipment()">
                        {{key}}:
                        <button v-if="value" class="button is-info" @click="equipButtonClick" :value="key">{{ value.name }}</button>
                        <button v-else class="button is-outlined" @click="equipButtonClick" :value="key">Empty</button>
                    </div>
                </div>
                <!--New Perks only appear when a cultist has available perk points-->
                <br>
                <div class="title is-6">Perks</div>
                <div v-if="activeCultist.cultist.getPerkPoints()">
                    <div>Perk points available: {{ activeCultist.cultist.getPerkPoints() }}</div>
                    <div class="container">
                        <div v-for="i in perks.default">
                            <span v-if="activeCultist.cultist.getLevel() >= i.level && !activeCultist.cultist.checkIfHasPerk(i.perkId)">
                                <button class="button is-info" @click="assignPerk" @mouseenter="mouseEnterPerk" @mouseleave="mouseLeavePerk" :value="i.perkId">{{ i.name }}</button>
                                <div v-if="i.perkId == selectedPerk.perk">
                                    <PerkTooltip class="perkTooltip" :perk="i"/>
                                </div>
                            </span>
                        </div>
                    </div>
                    <br>
                </div>
                <!--Display of unlocked perks-->
                <div>Unlocked</div>
                <div class="container">
                    <span v-for="i in activeCultist.cultist.getPerks()">
                        <button  class="button is-outlined" @mouseenter="mouseEnterPerk" @mouseleave="mouseLeavePerk" :value="i.perkId">{{i.name}}</button>
                        <div v-if="i.perkId == selectedPerk.perk">
                            <PerkTooltip class="perkTooltip" :perk="i" :unlocked="true"/>
                        </div>
                    </span>
                </div>
            </div>
            <!--default screen - appears if nothing else-->
            <div v-else>Select a cultist!</div>
        </div>
    </div>

</template>