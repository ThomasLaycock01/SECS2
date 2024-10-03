<script setup>
const props = defineProps({
    name: String,
    desc: String,
    effectDesc: {
        type: String,
        default: null
    },
    owned: {
        type: Number,
        default: null
    },
    costs: {
        type: Function,
        default: null
    }
})
</script>

<template>
    <div>
        <b class="mb-2">
            {{props.name}}{{ props.owned ? ` - Owned: ${props.owned}`  : "" }}
        </b>
        <p class="mb-2">
            {{props.desc}}
        </p>
        <p class="mb-2" v-if="props.effectDesc">
            {{ props.effectDesc }}
        </p>
        <div v-if="props.costs" class="mb-2">
            <ul v-for="value, key in props.costs()">
                <li>{{ key }} : {{ value }}</li>
            </ul>
        </div>
    </div>
</template>