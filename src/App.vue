<template>
    <router-view />
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useVersion } from './utils/Version';

export default defineComponent({
    name: 'App',
    setup() {
        const version = useVersion();
        console.log(version.toString());
    },
});
</script>
