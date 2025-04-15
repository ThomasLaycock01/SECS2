<script setup>
import ActionList from '../ActionList.vue';
import PerkTooltip from './PerkTooltip.vue';
import Tooltip from '../Tooltip.vue';

import { reactive } from 'vue';

import { useHRStore } from '@/stores/HR';
import { useCultistsStore } from "@/stores/globalPinias/cultists";
import { useInventoryStore } from '@/stores/globalPinias/inventory';
import { useExpansionsStore } from '@/stores/globalPinias/expansions';
import { useTooltipsStore } from '@/stores/misc/tooltips';
import { useModalsStore } from '@/stores/misc/modal';

import { perkCheck } from '@/functions';

import perks from "@/assets/json/perks.json";

const cultists = useCultistsStore();
const HR = useHRStore();
const inventory = useInventoryStore();
const expansions = useExpansionsStore();
const tooltips = useTooltipsStore();
const modals = useModalsStore();

var activeCultist = reactive({cultist: null});
var equipmentScreen = reactive({check: false, type: null, selectedItem: null});
var selectedPerk = reactive({perk: null});

//for the cultist half of the screen
function setNewActiveCultist(cultist) {
    activeCultist.cultist = cultist;
    equipmentScreen.check = false;
    equipmentScreen.selectedItem = null;
}



//for the display half of the screen
function equipButtonClick(type) {
    modals.openEquipment(activeCultist.cultist, type);
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
    if (equipmentScreen.selectedItem == null) {
        equipmentScreen.check = false;
        return;
    }

    const item = inventory.getItemById(equipmentScreen.selectedItem);
    activeCultist.cultist.equipItem(item);

    equipmentScreen.check = false;
    equipmentScreen.type = null;
    equipmentScreen.selectedItem = null;
}


//for the perk display
function mouseEnterPerk(id) {
    selectedPerk.perk = id
}

function mouseLeavePerk() {
    selectedPerk.perk = null;
}

function assignPerk(perk) {
    activeCultist.cultist.addPerk(perk);
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
            <div class="cultistGridContainer">
                <span v-for="i in cultists.getCultists" class="gridItem">
                    <button  class="button" :class="i.getPerkPoints() > 0 ? 'is-info' : 'is-dark'" @click="setNewActiveCultist(i)">{{i.getName()}}</button>
                </span>
                <span v-for="i in cultists.getCultistLimit - cultists.getNumOfCultists" class="gridItem">
                    <div class="button is-outlined" disabled>Empty</div>
                </span>
            </div>
            <div v-if="expansions.checkIfSummonAvailable">
                <div class="title is-5 mb-1 segment-title">Summons</div>
                <div class="cultistGridContainer">
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
            <div v-if="activeCultist.cultist">
                <div class="title is-5 mb-1 segment-title">{{ activeCultist.cultist.getName() }}</div>
                <b-tabs v-model="activeTab">
                    <!--Stats tab-->
                    <b-tab-item label="Stats">
                        <div @mouseover="tooltips.setActiveTooltip('activeCultistRace')" @mouseleave="tooltips.removeActiveTooltip()">{{ activeCultist.cultist.getRaceName() }}</div>
                        <span v-if="tooltips.getActiveTooltip == 'activeCultistRace'">
                            <Tooltip class="tooltip" :tooltipObj="tooltips.getRaceTooltip(activeCultist.cultist.getRaceId())" />
                        </span>
                        <div >{{activeCultist.cultist.getJob() ? activeCultist.cultist.getJob() : "Unemployed"}}</div>
                        <div>Level {{ activeCultist.cultist.getLevel() }} / {{ activeCultist.cultist.getLevelLimit() }}</div>
                        <div>{{ activeCultist.cultist.getXp() }} / {{ activeCultist.cultist.getXpNeeded() }} XP</div>
                        <br>
                        <div>
                            <ul>
                                <li v-if="activeCultist.cultist.getKnockedOut()">Knocked Out! {{ Math.floor(activeCultist.cultist.getKnockOutTime() / 60) }} Mins {{ activeCultist.cultist.getKnockOutTime() % 60 }} secs left</li>
                                <li v-else>{{ activeCultist.cultist.getCurrentHP() }}/{{ activeCultist.cultist.getStat("HP") }} HP</li>
                                <li>{{ activeCultist.cultist.getStat("atk") }} Atk</li>
                                <li>{{ activeCultist.cultist.getStat("def") }} Def</li>
                            </ul>
                        </div>                 
                    </b-tab-item>
                    <!--Perk tab-->
                    <b-tab-item :label="activeCultist.cultist.getPerkPoints() > 0 ? 'Perks(!)' : 'Perks'">
                        <!--New Perks only appear when a cultist has available perk points - for now-->
                        <div v-if="activeCultist.cultist.getPerkPoints()">
                            <div>Perk points available: {{ activeCultist.cultist.getPerkPoints() }}</div>
                            <div>
                                <span v-for="i in perks.default">
                                    <span v-if="perkCheck(i, activeCultist.cultist)">
                                        <button class="button is-info mr-1" @click="assignPerk(i)" @mouseenter="mouseEnterPerk(i.id)" @mouseleave="mouseLeavePerk">{{ i.name }}</button>
                                        <span v-if="i.id == selectedPerk.perk">
                                            <PerkTooltip class="perkTooltip" :perk="i"/>
                                        </span>
                                    </span>
                                </span>
                            </div>
                            <br>
                        </div>
                        <!--Display of unlocked perks-->
                        <div>Unlocked</div>
                        <div>
                            <span v-for="i in activeCultist.cultist.getPerks()">
                                <button  class="button is-outlined" @mouseenter="mouseEnterPerk(i.id)" @mouseleave="mouseLeavePerk" :value="i.id">{{i.name}}</button>
                                <div v-if="i.id == selectedPerk.perk">
                                    <PerkTooltip class="perkTooltip" :perk="i" :unlocked="true"/>
                                </div>
                            </span>
                        </div>
                    </b-tab-item>
                    <!--Equipment tab-->
                    <b-tab-item label="Equipment">
                        <div class="title is-6">Equipment</div>
                        <div>
                            <div v-for="value, key in activeCultist.cultist.getEquipment()">
                                {{key}}:
                                <span v-if="value">
                                    <button class="button is-info" @click="equipButtonClick(key)" @mouseover="tooltips.setActiveTooltip(`activeCultistItem${value.getId()}`)" @mouseleave="tooltips.removeActiveTooltip()">{{ value.getName() }}</button>
                                    <span v-if="tooltips.getActiveTooltip == `activeCultistItem${value.getId()}`">
                                        <Tooltip class="tooltip" :tooltipObj="tooltips.getItemTooltip(value)" />
                                    </span>
                                </span>
                                <button v-else class="button is-outlined" @click="equipButtonClick(key)">Empty</button>
                            </div>
                        </div>
                        <!--Inventory screen - appears when selecting new item for cultist to equip-->
                        <div v-if="activeCultist.cultist && equipmentScreen.check">
                            <div>Equipment: {{ equipmentScreen.type }}</div>
                            <div>Click to select.</div>
                            <div class="container">
                                <span v-for="i in inventory.getUnequippedItemByType(equipmentScreen.type)">
                                    <div>
                                        <button :class="i.getId() == equipmentScreen.selectedItem ? 'button is-info' : 'button is-dark'" @click="equipmentScreenButtonClick(i.getId())" @mouseover="tooltips.setActiveTooltip(`item${i.getId()}`)" @mouseleave="tooltips.removeActiveTooltip()">{{ i.shortName ? i.shortName : i.name }}</button>
                                        <span v-if="tooltips.getActiveTooltip == `item${i.getId()}`">
                                            <Tooltip class="tooltip" :tooltipObj="tooltips.getItemTooltip(i)"/>
                                        </span>
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
                    </b-tab-item>
                </b-tabs>
            </div>
            <!--default screen - appears if nothing else-->
            <div v-else>Select a cultist!</div>
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