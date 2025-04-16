<script setup>
import ActionList from '../ActionList.vue';
import PerkTooltip from './PerkTooltip.vue';
import Tooltip from '../Tooltip.vue';

import { reactive } from 'vue';

import { useHRStore } from '@/stores/HR';
import { useCultistsStore } from "@/stores/globalPinias/cultists";
import { useTooltipsStore } from '@/stores/misc/tooltips';
import { useModalsStore } from '@/stores/misc/modal';

import { perkCheck } from '@/functions';

import perks from "@/assets/json/perks.json";

const cultists = useCultistsStore();
const HR = useHRStore();
const tooltips = useTooltipsStore();
const modals = useModalsStore();

var activeCultist = reactive({cultist: null});
var selectedPerk = reactive({perk: null});

//for the cultist half of the screen
function cultistClick(cultist) {
    modals.openCultist(cultist);
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
                    <button  class="button" :class="i.getPerkPoints() > 0 ? 'is-info' : 'is-dark'" @click="cultistClick(i)">{{i.getName()}}</button>
                </span>
                <span v-for="i in cultists.getCultistLimit - cultists.getNumOfCultists" class="gridItem">
                    <div class="button is-outlined" disabled>Empty</div>
                </span>
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
                                    <button class="button is-info" @mouseover="tooltips.setActiveTooltip(`activeCultistItem${value.getId()}`)" @mouseleave="tooltips.removeActiveTooltip()">{{ value.getName() }}</button>
                                    <span v-if="tooltips.getActiveTooltip == `activeCultistItem${value.getId()}`">
                                        <Tooltip class="tooltip" :tooltipObj="tooltips.getItemTooltip(value)" />
                                    </span>
                                </span>
                                <button v-else class="button is-outlined">Empty</button>
                            </div>
                            <br>
                            <button class="button is-outlined" @click="modals.openEquipment(activeCultist.cultist)">Change Equipment</button>
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