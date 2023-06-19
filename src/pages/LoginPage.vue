<template>
    <q-page padding class="flex column items-center q-pt-xl">
        <div class="flex column q-gutter-y-lg" style="max-width: 500px; width: 90%">
            <div class="text-h2">Sign in</div>
            <div v-if="errorMessage" class="text-negative q-mt-xl q-mb-none text-bold bg-negative text-white q-py-md q-px-sm rounded-borders">{{ errorMessage }}</div>
            <div class="flex column q-gutter-y-md q-mt-md">
                <q-item v-for="provider in providers" :key="provider.name" class="bg-primary" clickable @click="() => useProvider(provider.class)">
                    <q-item-section avatar>
                        <q-icon color="white" name="mdi-login" size="lg" />
                    </q-item-section>

                    <q-item-section style="flex-wrap: nowrap; flex-direction: row; justify-content: flex-start; align-items: center" class="text-h6 text-white"> <span class="q-ml-md text-weight-light">Sign in with</span>&nbsp;{{ provider.name }}</q-item-section>
                    <q-item-section side>
                        <q-icon color="white" :name="provider.logoName" size="md" />
                    </q-item-section>
                </q-item>
                <q-expansion-item header-class="bg-primary" expand-icon-class="text-white" expand-icon="mdi-email" expanded-icon="mdi-email">
                    <template v-slot:header>
                        <q-item-section avatar>
                            <q-icon color="white" name="mdi-login" size="lg" />
                        </q-item-section>

                        <q-item-section style="flex-wrap: nowrap; flex-direction: row; justify-content: flex-start; align-items: center" class="text-h6 text-white"> <span class="q-ml-md text-weight-light">Sign in with</span>&nbsp;Email</q-item-section>
                    </template>

                    <q-card class="q-py-xl" bordered>
                        <user-login-form @success="onLogin" @error="onError" />
                    </q-card>
                </q-expansion-item>
            </div>
        </div>
    </q-page>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { GoogleAuthProvider, signInWithPopup, OAuthProvider, AuthProvider, GithubAuthProvider } from 'firebase/auth';
import { useFirebaseStore } from 'src/stores/firebase-store';
import UserLoginForm from 'src/components/UserLoginForm.vue';

interface OptionalOAuthProvider {
    name: string;
    logoName: string;
    class: new () => AuthProvider;
}

type FirebaseError = { message: string; code: string };

function translateFirebaseError(error: FirebaseError) {
    switch (error.code) {
        case 'auth/email-already-in-use':
            return 'There already exists an account with the given email address';
        case 'auth/invalid-email':
            return 'The email address is not valid';
        case 'auth/operation-not-allowed':
            return 'Email/password accounts are not enabled';
        case 'auth/weak-password':
            return 'The password is not strong enough';
        case 'auth/account-exists-with-different-credential':
            return 'This email is already registered with a different authentication provider';
        case 'auth/invalid-credential':
            return 'The credential is malformed or has expired';
        case 'auth/operation-not-allowed':
            return 'The type of account corresponding to the credential is not enabled';
        case 'auth/user-disabled':
            return 'This account has been disabled';
        case 'auth/user-not-found':
            return 'User not found';
        case 'auth/wrong-password':
            return "User/password don't match";
        // case 'auth/invalid-verification-code':
        //     return 'The credential is a PhoneAuthProvider.credential and the verification code of the credential is not valid.';
        // case 'auth/invalid-verification-id':
        //     return 'The credential is a PhoneAuthProvider.credential and the verification ID of the credential is not valid.id.';
    }

    return error.message;
}

const providers: Array<OptionalOAuthProvider> = [
    {
        name: 'Google',
        logoName: 'mdi-google',
        class: GoogleAuthProvider,
    },
    {
        name: 'Github',
        logoName: 'mdi-github',
        class: GithubAuthProvider,
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
            errorMessage: '',
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
                    .catch(this.onError)
                    .finally(() => this.$q.loading.hide());
            }, 800);
        },
        onError(error: FirebaseError) {
            console.error(error.code, error.message);

            const message = translateFirebaseError(error);
            this.errorMessage = message;
        },
        onLogin() {
            this.$router.push({ name: 'UploadImagePage' });
        },
    },
});
</script>
