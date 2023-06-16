<template>
    <div class="flex row flex-center no-wrap">
        <template v-for="x in size" :key="x">
            <input-cell :value="numbers[x - 1]" :is-active="activeIndex === x - 1" @click="() => (activeIndex = x - 1)" />
            <div v-if="chunkSize !== undefined && x % chunkSize === 0 && x !== size" style="width: 6px; border: 1px solid black; margin-left: 2px; margin-right: 2px"></div>
        </template>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import InputCell from './InputCell.vue';

export default defineComponent({
    components: { InputCell },
    emits: ['complete', 'input'],
    props: {
        size: {
            type: Number,
            required: true,
        },
        chunkSize: {
            type: Number,
            default: undefined,
        },
    },
    data() {
        const numbers: Array<number | undefined> = [];
        return {
            numbers,
            activeIndex: 0,
        };
    },
    methods: {
        addNumber(v: number): void {
            if (this.activeIndex === this.size) return;

            this.numbers[this.activeIndex] = v;
            this.activeIndex++;

            if (this.activeIndex === this.size) {
                this.$emit('complete', this.value);
            }
        },
        removeNumber(): void {
            if (this.activeIndex === 0) return;

            this.numbers[this.activeIndex] = undefined;
            this.activeIndex--;
        },
    },
    computed: {
        value() {
            return this.numbers
                .filter((n) => n !== undefined)
                .slice(0, this.size)
                .join('');
        },
    },
    watch: {
        value(nVal) {
            this.$emit('input', nVal);
        },
    },
});
</script>
