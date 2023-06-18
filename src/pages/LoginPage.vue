<template>
    <q-page padding class="flex column flex-center">
        <div id="login-box" class="flex column q-gutter-y-lg" style="max-width: 500px; width: 90%">
            <div class="text-h2">Sign in</div>
            <div id="login-options" class="flex column q-gutter-y-md">
                <q-btn size="lg" color="primary" align="left" icon="login" no-caps v-for="provider in providers" :key="provider.name" @click="() => useProvider(provider.class)"><span class="q-ml-md text-weight-light">Sign in with</span>&nbsp;{{ provider.name }}</q-btn>
                <div id="spacer" class="q-mt-xl">
                    <hr />
                    <div><span class="text-italic text-subtitle1">Or</span></div>
                </div>
                <user-login-form @success="onLogin" :create-account-mode="createAccountMode" />
            </div>
        </div>
        <div class="q-mt-xl flex flex-center"><q-checkbox dense v-model="createAccountMode" class="q-ml-md" color="secondary" label="Create account" /></div>
    </q-page>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { GoogleAuthProvider, FacebookAuthProvider, signInWithPopup, OAuthProvider, AuthProvider } from 'firebase/auth';
import { useFirebaseStore } from 'src/stores/firebase-store';
import UserLoginForm from 'src/components/UserLoginForm.vue';

interface OptionalOAuthProvider {
    name: string;
    class: new () => AuthProvider;
}

const providers: Array<OptionalOAuthProvider> = [
    {
        name: 'Google',
        class: GoogleAuthProvider,
    },
    {
        name: 'Facebook',
        class: FacebookAuthProvider,
    },
];

export default defineComponent({
    components: { UserLoginForm },
    setup() {
        const firebaseStore = useFirebaseStore();
        return {
            firebaseStore,
            providers,
        };
    },
    data() {
        return {
            createAccountMode: false,
        };
    },
    methods: {
        useProvider(providerClass: new () => AuthProvider) {
            const provider = new providerClass() as unknown as OAuthProvider;
            provider.setCustomParameters({
                prompt: 'select_account',
            });

            this.$q.loading.show({});
            setTimeout(() => {
                signInWithPopup(this.firebaseStore.authentication, provider)
                    .then(() => {
                        this.onLogin();
                    })
                    .catch((error) => {
                        const errorCode = error.code;
                        const errorMessage = error.message;
                        console.error(errorCode, errorMessage);
                    })
                    .finally(() => this.$q.loading.hide());
            }, 800);
        },
        onLogin() {
            this.$router.push({ name: 'UploadImagePage' });
        },
    },
});
</script>
