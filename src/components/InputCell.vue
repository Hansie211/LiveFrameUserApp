<template>
    <q-chip style="width: 1.5em; height: 2.2em; font-weight: bold; font-size: 1.1em; padding: 2px; margin: 2px" :style="{ 'border-width': isActive ? '2px' : undefined }" :color="color" outline clickable @click="(e) => $emit('click', e)"> {{ isActive ? '*' : value ?? '' }}</q-chip>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
    emits: ['click'],
    props: {
        value: {
            type: Number,
            default: undefined,
        },
        isActive: {
            type: Boolean,
            default: false,
        },
    },
    computed: {
        color() {
            if (this.isActive) return 'primary';
            if (this.value === undefined) return 'grey';
            return 'black';
        },
    },
});
</script>

<style>
.q-chip__content {
    justify-content: center;
}
</style>
