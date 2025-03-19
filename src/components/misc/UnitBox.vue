<script setup>

const props = defineProps({
    unit: Object,
    type: String
})

const unit = props.unit;

</script>


<template>

<div class="unitBox">
    <div v-if="props.type == 'cultist'">{{ unit.getName() }} - {{ unit.getRole().getName() }}</div>
    <div v-else>{{ unit.getName() }}</div>
    <div>
        <table class="table is-bordered is-narrow" v-if="props.type != 'cultist' || !unit.getKnockedOut()">
            <tbody>
                <tr>
                    <th>{{ unit.getCurrentHP() }}/{{ unit.getStat("HP") }} HP</th>
                    <th>{{ unit.getStat("spd") }} Spd</th>
                </tr>
                <tr>
                    <td>{{ unit.getAtkValue("phys") }} P-Atk</td>
                    <td>{{ unit.getAtkValue("mag") }} M-Atk</td>
                </tr>
                <tr>
                    <td>{{ unit.getDefValue("phys") }} P-Def</td>
                    <td>{{ unit.getDefValue("mag") }} M-Def</td>
                </tr>
            </tbody>
        </table>
        <div v-else>Knocked out! {{ Math.floor(unit.getKnockOutTime() / 60) }} Mins {{ unit.getKnockOutTime() % 60 }} secs left</div>
    </div>
</div>

</template>