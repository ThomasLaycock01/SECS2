<script setup>
const props = defineProps({
    data: Object
})
</script>

<template>
    <div>
        <b class="mb-2">
            {{props.data.name}}
        </b>
        <p class="mb-2">
            {{props.data.desc}}
        </p>
        <div v-if="props.data.costs" class="mb-2">
            <p>{{ props.data.costs }}</p>
            <!--<ul v-for="value, key in data.costs()">
                <li>{{ key }} : {{ value }}</li>
            </ul>-->
        </div>
    </div>
</template>