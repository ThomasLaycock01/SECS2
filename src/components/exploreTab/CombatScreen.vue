<script setup>
import UnitBox from '../misc/UnitBox.vue';

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
                <span v-if="areaObject.getActiveParty()">
                    <span v-for="i in areaObject.getActiveParty().getSlots()">
                        <br>
                        <div v-if="i.cultist && i.cultist.getRole()">
                            <UnitBox :unit="i.cultist" type="cultist" :key="i.cultist.getId()"/>
                        </div>
                    </span>
                </span>
            </div>

            <!--Displaying enemies-->
            <div v-if="areaObject.getCurrentEncounter().length > 0">
                Enemies:
                <span v-for="i, index in areaObject.getCurrentEncounter()">
                    <br>
                    <UnitBox :unit="i" type="enemy" :key="i.getId()"/>
                </span>
            </div>

        </div>
    </div>

</template>