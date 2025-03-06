<script setup>
const props = defineProps({
    areaObject: Object,
    type: String
});
</script>



<template>

    <div>
        <div v-if="props.type == 'explore'">
            <p>Level {{ areaObject.getCurrentLevel() }}/{{ areaObject.getMaxLevel() }}</p>
            <button class="button is-dark is-small" @click="areaObject.decreaseCurrentLevel()" :disabled="areaObject.getCurrentLevel() - 1 < 1">-</button>
            <button class="button is-dark is-small" @click="areaObject.increaseCurrentLevel()" :disabled="areaObject.getCurrentLevel() + 1 > areaObject.getMaxLevel()">+</button>
            <p v-if="areaObject.checkAtMaxLevel()">{{ 10 - areaObject.getLevelProgress() }} encounters until next level!</p>
        </div>
        <div v-else>
            <p>Encounter {{areaObject.getCurrentEncounterNum()}}/{{ areaObject.getLength() }}</p>
        </div>
        <br>

        <div class="combatDisplay">

            <!--Party display-->
            <div>
                Party:
                <span v-for="i in areaObject.getActiveParty().getSlots()">
                    <br>
                    <div v-if="i.cultist" class="unitBox">
                        <div>{{ i.cultist.getName() }} - {{ i.cultist.getRole().getName() }}</div>
                        <div>
                            <table class="table is-bordered is-narrow" v-if="!i.cultist.getKnockedOut()">
                                <tbody>
                                    <tr>
                                        <th>{{ i.cultist.getCurrentHP() }}/{{ i.cultist.getStat("HP") }} HP</th>
                                        <th>{{ i.cultist.getStat("spd") }} Spd</th>
                                    </tr>
                                    <tr>
                                        <td>{{ i.cultist.getAtkValue("phys") }} P-Atk</td>
                                        <td>{{ i.cultist.getAtkValue("mag") }} M-Atk</td>
                                    </tr>
                                    <tr>
                                        <td>{{ i.cultist.getDefValue("phys") }} P-Def</td>
                                        <td>{{ i.cultist.getDefValue("mag") }} M-Def</td>
                                    </tr>
                                </tbody>
                            </table>
                            <div v-else>Knocked out! {{ Math.floor(i.cultist.getKnockOutTime() / 60) }} Mins {{ i.cultist.getKnockOutTime() % 60 }} secs left</div>
                        </div>
                    </div>
                </span>
            </div>

            <!--Displaying enemies-->
            <div v-if="areaObject.getCurrentEncounter().length > 0">
                Enemies:
                <span v-for="i in areaObject.getCurrentEncounter()">
                    <br>
                    <div class="unitBox">
                        <div>{{ i.getName() }}</div>
                        <div>
                            <table class="table is-bordered is-narrow">
                                <tbody>
                                    <tr>
                                        <th>{{ i.getCurrentHP() }}/{{ i.getStat("HP") }} HP</th>
                                        <th>{{ i.getStat("spd") }} Spd</th>
                                    </tr>
                                    <tr>
                                        <td>{{ i.getAtkValue("phys") }} P-Atk</td>
                                        <td>{{ i.getAtkValue("mag") }} M-Atk</td>
                                    </tr>
                                    <tr>
                                        <td>{{ i.getDefValue("phys") }} P-Def</td>
                                        <td>{{ i.getDefValue("mag") }} M-Def</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </span>
            </div>

        </div>
    </div>

</template>