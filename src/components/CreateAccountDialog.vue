<template>
    <q-dialog ref="dialog" @hide="onDialogHide">
        <q-card class="q-dialog-plugin q-pa-md">
            <q-form ref="form" @submit.prevent="onSubmit">
                <q-card-section class="q-px-md q-mt-md">
                    <div class="text-h4">Register account</div>
                </q-card-section>
                <q-card-section class="q-px-md q-mt-md">
                    <q-input ref="emailInput" label="Email address" lazy-rules :rules="[(val) => !!val || '']" v-model="email" type="email">
                        <template v-slot:append> <q-icon size=".8em" name="email" /></template>
                    </q-input>
                    <q-input stack-label label="Password" class="q-mt-sm" :type="passwordVisible ? 'text' : 'password'" :rules="[(val) => !!val || '']" v-model="password">
                        <template v-slot:append> <q-icon size=".8em" :name="passwordVisible ? 'visibility' : 'visibility_off'" class="cursor-pointer" @click="passwordVisible = !passwordVisible" /></template>
                    </q-input>
                    <q-input stack-label label="Confirm password" :type="passwordVisible ? 'text' : 'password'" :rules="[(val) => !!val || '']" v-model="passwordConfirm">
                        <template v-slot:append> <q-icon size=".8em" :name="passwordVisible ? 'visibility' : 'visibility_off'" class="cursor-pointer" @click="passwordVisible = !passwordVisible" /></template>
                    </q-input>
                </q-card-section>
                <q-card-section class="">
                    <div v-if="errorMessage" style="border-bottom: 1px solid var(--q-negative)" class="text-negative q-mt-none q-mb-md">{{ errorMessage }}</div>
                </q-card-section>
                <q-card-actions align="right">
                    <div class="q-gutter-x-md">
                        <q-btn color="negative" outline label="Cancel" @click="onCancelClick" />
                        <q-btn color="primary" label="Register" type="submit" />
                    </div>
                </q-card-actions>
            </q-form>
        </q-card>
    </q-dialog>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { useFirebaseStore } from 'src/stores/firebase-store';

export default defineComponent({
    emits: ['ok', 'hide'],

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
            errorMessage: '',
            passwordVisible: false,
        };
    },

    computed: {
        dialog() {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const refs = this.$refs as any;
            return refs['dialog'] as { show: () => void; hide: () => void };
        },
    },

    methods: {
        show() {
            this.dialog.show();
        },

        hide() {
            this.dialog.hide();
        },

        onDialogHide() {
            this.$emit('hide');
        },

        onSubmit() {
            this.errorMessage = '';
            const auth = this.firebaseStore.authentication;

            if (this.password !== this.passwordConfirm) {
                this.errorMessage = "Passwords don't match.";
                return;
            }

            createUserWithEmailAndPassword(auth, this.email, this.password)
                .then((userCredential) => {
                    // Signed in
                    const user = userCredential.user;
                    console.log(user);
                })
                .catch((error) => {
                    const errorCode = error.code;
                    const errorMessage = error.message;

                    console.log(errorCode, errorMessage);
                });
        },

        onOKClick() {
            this.$emit('ok');
            this.hide();
        },

        onCancelClick() {
            this.hide();
        },
    },
});
</script>
