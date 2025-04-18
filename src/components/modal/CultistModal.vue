<script setup>
import { reactive } from 'vue';

import Tooltip from '../Tooltip.vue';
import PerkTooltip from '../HRTab/PerkTooltip.vue';

import { useModalsStore } from '@/stores/misc/modal';
import { useTooltipsStore } from '@/stores/misc/tooltips';
import { usePartiesStore } from '@/stores/barracks/parties';

import { perkCheck } from '@/functions';

import perks from "@/assets/json/perks.json";

const modals = useModalsStore();
const tooltips = useTooltipsStore();
const parties = usePartiesStore();

const cultist = modals.getCultistCultist;

var selected = reactive({perk: null});

//for the perk display
function mouseEnterPerk(id) {
    selected.perk = id
}

function mouseLeavePerk() {
    selected.perk = null;
}

function assignPerk(perk) {
    cultist.addPerk(perk);
    selected.perk = null;
}

function roleClick(role) {
    if (cultist.getRole() && cultist.getRole().getId() == role.getId() && !cultist.getParty()) {
        cultist.removeRole();
    }
    else {
        cultist.setRole(role);
    }
}

function levelUpClick(stat) {
    cultist.useLevelUp(stat);
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
                <b-tab-item :label="cultist.checkLevelUpAvailable() ? 'Overview(!)' : 'Overview'">
                    <div class="columns">
                        <!--Stats column-->
                        <div class="column is-one-quarter">
                            <div class="title is-6">Stats</div>
                            <div @mouseover="tooltips.setActiveTooltip('activeCultistRace')" @mouseleave="tooltips.removeActiveTooltip()">{{ cultist.getRaceName() }}</div>
                            <span v-if="tooltips.getActiveTooltip == 'activeCultistRace'">
                                <Tooltip class="tooltip" :tooltipObj="tooltips.getRaceTooltip(cultist.getRaceId())" />
                            </span>
                            <div>{{cultist.getJob() ? cultist.getJob() : "Unemployed"}}</div>
                            <div>{{ cultist.getRole() ? cultist.getRole().getName() : "No Role" }}</div>
                            <div>Level {{ cultist.getLevel() }} / {{ cultist.getLevelLimit() }}</div>
                            <div>{{ cultist.getXp() }} / {{ cultist.getXpNeeded() }} XP</div>
                            <br>
                            <div>
                                <ul>
                                    <li class="inline-blockContainer">
                                        <div v-if="cultist.getKnockedOut()" class="mr-2">
                                            Knocked Out! {{ Math.floor(cultist.getKnockOutTime() / 60) }} Mins {{ cultist.getKnockOutTime() % 60 }} secs left
                                        </div>
                                        <div v-else class="mr-2">
                                            {{ cultist.getCurrentHP() }}/{{ cultist.getStat("HP") }} HP
                                        </div>
                                        <button v-if="cultist.checkLevelUpAvailable()" class="button is-dark is-small" @click="levelUpClick('HP')">+{{ cultist.getLevelUp("HP") }}</button>
                                    </li>
                                    <li class="inline-blockContainer">
                                        <div class="mr-2">{{ cultist.getStat("atk") }} Atk</div>
                                        <button v-if="cultist.checkLevelUpAvailable()" class="button is-dark is-small" @click="levelUpClick('atk')">+{{ cultist.getLevelUp("atk") }}</button>
                                    </li> 
                                    <li class="inline-blockContainer">
                                        <div class="mr-2">{{ cultist.getStat("def") }} Def</div>
                                        <button v-if="cultist.checkLevelUpAvailable()" class="button is-dark is-small" @click="levelUpClick('def')">+{{ cultist.getLevelUp("def") }}</button>
                                    </li>                                 </ul>
                            </div>           
                        </div>
                        <!--Equipment Column-->
                        <div class="column is-one-quarter">
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
                        </div>
                    </div>      
                    </b-tab-item>
                    <!--Role tab-->
                    <b-tab-item label="Role">
                        <div class="columns">
                            <div class="column is-half">
                                <div class="title is-5 mb-1 segment-title">Roles</div>
                                <div v-if="cultist.getParty()">Note: Cultists must have a role whilst in a party</div>
                                <div class="cultistGridContainer">
                                    <span v-for="i in parties.getUnlockedRoles">
                                        <button  class="button cultistGridItem" :class="cultist.getRole() && cultist.getRole().getId() == i.getId() ? 'is-info' : 'is-dark'" @click="roleClick(i)">{{i.getName()}}</button>
                                    </span>
                                </div>
                            </div>
                            <div class="column is-half">
                                <div v-if="cultist.getRole()">
                                <div class="title is-5 mb-1 segment-title">{{cultist.getRole().getName()}}</div>
                                <div>{{ cultist.getRole().getDesc() }}</div>
                                <br>
                                <div class="partySelectorTableLine">
                                    <div>
                                        <table class="table">
                                        <thead>
                                            <tr>
                                                <th></th>
                                                <th>Physical</th>
                                                <th>Magical</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td>Atk</td>
                                                <td>{{ cultist.getRole().getAtkMod("phys") * 100 }}%</td>
                                                <td>{{ cultist.getRole().getAtkMod("mag") * 100 }}%</td>
                                            </tr>
                                            <tr>
                                                <td>Def</td>
                                                <td>{{ cultist.getRole().getDefMod("phys") * 100 }}%</td>
                                                <td>{{ cultist.getRole().getDefMod("mag") * 100 }}%</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                    </div>
                                </div>
                            </div>
                            </div>
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
                                        <span v-if="i.id == selected.perk">
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
                                <span v-if="i.id == selected.perk">
                                    <PerkTooltip class="perkTooltip" :perk="i" :unlocked="true"/>
                                </span>
                            </span>
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