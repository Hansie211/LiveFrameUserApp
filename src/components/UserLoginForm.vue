<template>
    <div style="position: relative">
        <q-form ref="form" @submit.prevent="onSubmit" id="user-login" class="q-gutter-y-md q-px-md">
            <q-input ref="emailInput" label="Email address" autocomplete="off" hint="" lazy-rules :rules="[(val) => !!val || '']" v-model="email" type="email" />
            <q-input label="Password" :type="passwordVisible ? 'text' : 'password'" :rules="[(val) => !!val || '']" v-model="password">
                <template v-slot:append> <q-icon :name="passwordVisible ? 'visibility' : 'visibility_off'" class="cursor-pointer" @click="passwordVisible = !passwordVisible" /></template>
            </q-input>
            <div id="error-message" v-if="errorMessage" class="text-negative q-mt-none q-mb-md">{{ errorMessage }}</div>
            <q-btn label="Sign in" color="secondary" class="full-width" type="submit" />
        </q-form>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useFirebaseStore } from 'src/stores/firebase-store';

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
            passwordVisible: false,
            errorMessage: '',
        };
    },
    methods: {
        onSubmit() {
            const email = this.email;
            const password = this.password;
            signInWithEmailAndPassword(this.firebaseStore.authentication, email, password)
                .then((userCredential) => {
                    this.$emit('success', userCredential);
                })
                .catch((error) => {
                    console.debug(error);
                    this.errorMessage = `Error: ${error.code}`;
                    this.emailInput.focus();
                    this.password = '';
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
