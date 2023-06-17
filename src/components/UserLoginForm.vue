<template>
    <div style="position: relative">
        <q-form ref="form" @submit.prevent="onSubmit" class="fit q-gutter-y-md q-px-md">
            <q-input ref="emailInput" label="Email address" lazy-rules :rules="[(val) => !!val || 'Field is required']" v-model="email" type="email">
                <template v-slot:append> <q-icon size=".75em" name="email" /></template>
            </q-input>
            <q-input label="Password" :type="passwordVisible ? 'text' : 'password'" :rules="[(val) => !!val || 'Field is required', (val) => !createAccountMode || val?.length >= 6 || 'Password should be at least 6 characters']" v-model="password">
                <template v-slot:append> <q-icon size=".75em" :name="passwordVisible ? 'visibility' : 'visibility_off'" class="cursor-pointer" @click="passwordVisible = !passwordVisible" /></template>
            </q-input>
            <div :style="{ transform: createAccountMode ? '' : 'scale(0)' }">
                <q-input label="Password confirm" :type="passwordVisible ? 'text' : 'password'" :rules="[(val) => !createAccountMode || !!val || 'Field is required', (val) => !createAccountMode || val === password || 'Passwords don\'t match']" reactive-rules v-model="passwordConfirm" />
            </div>
            <q-btn :label="createAccountMode ? 'Register' : 'Sign in'" color="secondary" class="full-width q-mt-lg" type="submit" />
            <div v-if="errorMessage" class="text-negative q-my-md text-bold bg-negative text-white q-py-md q-px-sm rounded-borders">{{ errorMessage }}</div>
        </q-form>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { useFirebaseStore } from 'src/stores/firebase-store';

function translateFirebaseError(error: { message: string; code: string }) {
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
            return 'There already exists an account with the email address asserted by the credential';
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

export default defineComponent({
    props: {
        createAccountMode: {
            type: Boolean,
            default: false,
        },
    },
    emits: ['success', 'error'],
    setup() {
        const firebaseStore = useFirebaseStore();
        return {
            firebaseStore,
        };
    },
    data() {
        return {
            email: '',
            password: '',
            passwordConfirm: '',
            passwordVisible: false,
            errorMessage: '',
        };
    },
    methods: {
        onSubmit() {
            const email = this.email;
            const password = this.password;
            const passwordConfirm = this.passwordConfirm;

            this.errorMessage = '';
            if (this.createAccountMode && password !== passwordConfirm) {
                this.errorMessage = "Passwords don't match.";
                return;
            }

            const authenticationMethod = this.createAccountMode ? createUserWithEmailAndPassword : signInWithEmailAndPassword;
            authenticationMethod(this.firebaseStore.authentication, email, password)
                .then((userCredential) => {
                    this.$emit('success', userCredential);
                })
                .catch((error) => {
                    console.debug(error);

                    this.errorMessage = `Error: ${translateFirebaseError(error)}`;

                    this.emailInput.focus();
                    this.password = '';
                    this.passwordConfirm = '';
                    this.form.reset();

                    this.$emit('error', error);
                });
        },
    },
    computed: {
        emailInput() {
            return (this.$refs as { [key: string]: object })['emailInput'] as { focus: () => void };
        },
        form() {
            return (this.$refs as { [key: string]: object })['form'] as { reset: () => void };
        },
    },
});
</script>

<style scoped>
#user-login {
    width: 100%;
    height: 100%;
}
</style>
