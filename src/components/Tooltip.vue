<script setup>
const props = defineProps({
    name: String,
    desc: String,
    costs: {
        type: Function,
        default: null
    }
})
</script>

<template>
    <div>
        <b class="mb-2">
            {{props.name}}
        </b>
        <p class="mb-2">
            {{props.desc}}
        </p>
        <div v-if="props.costs" class="mb-2">
            <ul v-for="value, key in props.costs()">
                <li>{{ key }} : {{ value }}</li>
            </ul>
        </div>
    </div>
</template>