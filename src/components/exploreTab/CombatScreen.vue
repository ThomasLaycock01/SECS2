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
        <br>

        <div class="combatDisplay">

            <!--Party display-->
            <div>
                Party:
                <br>
                <span v-for="i in areaObject.getActiveParty().getSlots()">
                    <div v-if="i.cultist">
                        <div>{{ i.cultist.getName() }} - {{ i.role.getName() }} - <span v-if="!i.cultist.getKnockedOut()">{{ i.cultist.getCurrentHP() }}/{{ i.cultist.getStat("HP") }}</span><span v-else>Knocked Out! {{ Math.floor(i.cultist.getKnockOutTime() / 60) }} Mins {{ i.cultist.getKnockOutTime() % 60 }} secs left</span></div>
                        <div>
                            <ul class="inline-flexContainer">
                                <li>{{ i.cultist.getStat("atk") }} A</li>
                                <li>{{ i.cultist.getStat("def") }} D</li>
                                <li>{{ i.cultist.getStat("spd") }} S</li>
                            </ul>
                        </div>
                    </div>
                </span>
            </div>

            <!--Displaying enemies-->
            <div v-if="areaObject.getCurrentEncounter().length > 0">
                Enemies:
                <br>
                <div v-for="i in areaObject.getCurrentEncounter()">
                    <div>{{ i.getName() }} - {{ i.getCurrentHP() }}/{{ i.getStat("HP") }}</div>
                        <div>
                            <ul class="inline-flexContainer">
                                <li>{{ i.getStat("atk") }} A</li>
                                <li>{{ i.getStat("def") }} D</li>
                                <li>{{ i.getStat("spd") }} S</li>
                            </ul>
                        </div>
                </div>
            </div>

        </div>
    </div>

</template>