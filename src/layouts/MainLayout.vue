<template>
    <q-layout view="lHh Lpr lFf">
        <q-header elevated>
            <q-toolbar>
                <q-toolbar-title> Live Frame App <span style="font-size: 0.6em">v0.0.2</span></q-toolbar-title>
                <user-card v-if="firebaseStore.user" :user="firebaseStore.user" class="q-mr-sm" />
                <q-btn flat round dense icon="logout" aria-label="logout" title="Log Out" @click="logout" />
            </q-toolbar>
        </q-header>

        <q-page-container>
            <router-view />
        </q-page-container>
    </q-layout>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { signOut } from 'firebase/auth';
import { useFirebaseStore } from 'src/stores/firebase-store';
import UserCard from 'src/components/UserCard.vue';

export default defineComponent({
    name: 'MainLayout',
    components: { UserCard },
    setup() {
        const firebaseStore = useFirebaseStore();
        return {
            firebaseStore,
        };
    },
    methods: {
        logout() {
            signOut(this.firebaseStore.authentication)
                .then(() => {
                    this.$router.push({ name: 'LoginPage' });
                })
                .catch((error) => {
                    console.log(error);
                });
        },
    },
});
</script>
