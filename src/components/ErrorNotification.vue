<template>
    <div style="position: relative">
        <div id="alert" v-show="isVisible">
            <div id="close-btn">
                <q-btn flat round size="sm" icon="mdi-close" @click="() => (isVisible = false)" />
            </div>
            <div id="title">{{ caption }}</div>
            <div id="content">{{ text }}</div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
    emits: ['close'],
    data() {
        return {
            caption: 'Alert',
            text: '',
            isVisible: false,
        };
    },
    methods: {
        show(caption: string, text: string) {
            this.caption = caption;
            this.text = text;
            this.isVisible = true;
        },
    },
    expose: ['show'],
});
</script>
<style scoped>
#alert {
    background-color: var(--q-negative);
    padding: 15px;
    color: white;
    --top-corner-radius: 10px;
    border-top-left-radius: var(--top-corner-radius);
    border-top-right-radius: var(--top-corner-radius);
    position: relative;
}

#close-btn {
    position: absolute;
    right: 15px;
    top: 15px;
}

#title {
    font-size: 1.5em;
    font-weight: bold;
    margin-bottom: 10px;
}

#content {
    font-size: 1.1em;
}
</style>
