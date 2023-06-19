<template>
    <div style="position: relative">
        <q-form ref="form" @submit.prevent="onSubmit" class="fit q-gutter-y-md q-px-md">
            <q-input ref="emailInput" label="Email address" lazy-rules :rules="[(val) => !!val || 'Field is required']" v-model="email" type="email" no-error-icon>
                <template v-slot:append> <q-icon size=".75em" name="mdi-email" /></template>
            </q-input>
            <q-input label="Password" :type="passwordVisible ? 'text' : 'password'" :rules="[(val) => !!val || 'Field is required', (val) => !createAccountMode || val?.length >= 6 || 'Password should be at least 6 characters']" v-model="password" no-error-icon>
                <template v-slot:append> <q-icon size=".75em" :name="passwordVisible ? 'mdi-eye' : 'mdi-eye-off'" class="cursor-pointer" @click="passwordVisible = !passwordVisible" /></template>
            </q-input>
            <div :style="{ transform: createAccountMode ? '' : 'scale(0)' }">
                <q-input
                    label="Password confirm"
                    :type="passwordVisible ? 'text' : 'password'"
                    :rules="[(val) => !createAccountMode || !!val || 'Field is required', (val) => !createAccountMode || val === password || 'Passwords don\'t match']"
                    reactive-rules
                    v-model="passwordConfirm"
                    no-error-icon
                />
            </div>
            <q-btn :label="createAccountMode ? 'Register' : 'Sign in'" color="secondary" class="full-width q-mt-lg" type="submit" />
            <q-btn label="I forgot my password" flat no-caps dense padding="none md" @click="onPasswordForgotClick" />
            <div class="q-mt-xl flex flex-center"><q-toggle dense v-model="createAccountMode" class="q-ml-md" color="secondary" label="Create account" /></div>
        </q-form>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { useFirebaseStore } from 'src/stores/firebase-store';
import PasswordForgottenDialog from './PasswordForgottenDialog.vue';

export default defineComponent({
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
            createAccountMode: false,
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
                    this.emailInput.focus();
                    this.password = '';
                    this.passwordConfirm = '';
                    this.form.reset();

                    this.$emit('error', error);
                });
        },
        onPasswordForgotClick() {
            this.$q
                .dialog({
                    component: PasswordForgottenDialog,
                    componentProps: {
                        initialEmail: this.email,
                    },
                })
                .onOk((data) => {
                    this.email = data;
                    this.createAccountMode = false;
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
