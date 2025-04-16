<script setup>
import { reactive } from 'vue';

import Tooltip from '../Tooltip.vue';
import PerkTooltip from '../HRTab/PerkTooltip.vue';

import { useModalsStore } from '@/stores/misc/modal';
import { useTooltipsStore } from '@/stores/misc/tooltips';

import perks from "@/assets/json/perks.json";

const modals = useModalsStore();
const tooltips = useTooltipsStore();

const cultist = modals.getCultistCultist;

var selectedPerk = reactive({perk: null});

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

    <div class="modalBackdrop" @click="modals.closeCultist()"></div>

    <div class="generalModal">
        <div class="modalHeader">
            <p>{{ cultist.getName() }}</p>
        </div>

        <div class="modalBody">
            <b-tabs v-model="activeTab">
                <!--Stats tab-->
                <b-tab-item label="Stats">
                        <div @mouseover="tooltips.setActiveTooltip('activeCultistRace')" @mouseleave="tooltips.removeActiveTooltip()">{{ cultist.getRaceName() }}</div>
                        <span v-if="tooltips.getActiveTooltip == 'activeCultistRace'">
                            <Tooltip class="tooltip" :tooltipObj="tooltips.getRaceTooltip(cultist.getRaceId())" />
                        </span>
                        <div >{{cultist.getJob() ? cultist.getJob() : "Unemployed"}}</div>
                        <div>Level {{ cultist.getLevel() }} / {{ cultist.getLevelLimit() }}</div>
                        <div>{{ cultist.getXp() }} / {{ cultist.getXpNeeded() }} XP</div>
                        <br>
                        <div>
                            <ul>
                                <li v-if="cultist.getKnockedOut()">Knocked Out! {{ Math.floor(cultist.getKnockOutTime() / 60) }} Mins {{ cultist.getKnockOutTime() % 60 }} secs left</li>
                                <li v-else>{{ cultist.getCurrentHP() }}/{{ cultist.getStat("HP") }} HP</li>
                                <li>{{ cultist.getStat("atk") }} Atk</li>
                                <li>{{ cultist.getStat("def") }} Def</li>
                            </ul>
                        </div>                 
                    </b-tab-item>
                    <!--Perk tab-->
                    <b-tab-item :label="cultist.getPerkPoints() > 0 ? 'Perks(!)' : 'Perks'">
                        <p>Available Perk Points: {{ cultist.getPerkPoints() }}</p>
                        <br>
                        <!--New Perks only appear when a cultist has available perk points - for now-->
                        <div v-if="cultist.getPerkPoints()">
                            <div>Perk points available: {{ cultist.getPerkPoints() }}</div>
                            <div>
                                <span v-for="i in perks.default">
                                    <span v-if="perkCheck(i, cultist)">
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
                            <span v-for="i in cultist.getPerks()">
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
                            <div v-for="value, key in cultist.getEquipment()">
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
                            <button class="button is-outlined" @click="modals.openEquipment(cultist)">Change Equipment</button>
                        </div>
                    </b-tab-item>
            </b-tabs>
        </div>

        <div class="modalFooter">
            <button class="button is-dark" @click="modals.closeCultist()">Close</button>
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