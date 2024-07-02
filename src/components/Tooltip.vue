<script setup>
const props = defineProps({
    tooltipData: Object
})

const data = props.tooltipData;
</script>

<template>
    <div>
        <b class="mb-2">
            {{data.title}}
        </b>
        <p class="mb-2">
            {{data.body}}
        </p>
        <div v-if="data.costs" class="mb-2">
            <ul v-for="value, key in data.costs()">
                <li>{{ key }} : {{ value }}</li>
            </ul>
        </div>
        <p v-if="data.flavour" class="flavour">
            {{ data.flavour }}
        </p>
    </div>
</template>