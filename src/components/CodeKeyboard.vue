<template>
    <div class="flex row justify-end full-width">
        <q-btn v-for="x in 10" :key="x" class="keyboard-button" :label="x % 10" @click="() => $emit('input', x % 10)" />
        <q-btn class="keyboard-button" style="font-size: unset !important" icon="backspace" @click="() => $emit('delete')" />
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
    emits: ['input', 'delete'],
});
</script>

<style scoped>
.keyboard-button {
    width: 30%;
    margin-left: 1.5%;
    margin-right: 1.5%;
    margin-top: 30px;
    min-height: 75px;
    font-size: 2em;
}
</style>
