<template>
    <q-dialog ref="dialog" @hide="onDialogHide">
        <q-card class="q-dialog-plugin q-pa-md">
            <q-form ref="form" @submit.prevent="onSubmit">
                <q-card-section>
                    <div class="text-h5 q-mb-md">Password forgotten</div>
                    <div v-if="errorMessage" class="text-negative q-my-md text-bold bg-negative text-white q-py-md q-px-sm rounded-borders">{{ errorMessage }}</div>
                    <q-input clear-icon="q-mt-md" label="Email address" lazy-rules :rules="[(val) => !!val || 'Field is required']" v-model="email" type="email" no-error-icon>
                        <template v-slot:append> <q-icon size=".75em" name="mdi-email" /></template>
                    </q-input>
                    <div align="right">
                        <q-btn color="primary" label="Send recovery link" padding="sm xl" type="submit" />
                    </div>
                </q-card-section>
            </q-form>
        </q-card>
    </q-dialog>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { sendPasswordResetEmail } from 'firebase/auth';
import { useFirebaseStore } from 'src/stores/firebase-store';

export default defineComponent({
    props: {
        initialEmail: {
            type: String,
            default: '',
        },
    },
    setup() {
        const firebaseStore = useFirebaseStore();
        const authentication = firebaseStore.authentication;

        return {
            authentication,
        };
    },

    emits: ['ok', 'hide'],
    data() {
        return {
            email: this.initialEmail,
            errorMessage: '',
        };
    },

    computed: {
        dialog() {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            return (this.$refs as any)['dialog'] as {
                show: () => void;
                hide: () => void;
            };
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

        async onSubmit() {
            sendPasswordResetEmail(this.authentication, this.email)
                .then(() => {
                    this.$q
                        .dialog({
                            title: 'Recovery code sent',
                            message: "Check your inbox. If the email address you provided is recognized, an email with a recovery link and instructions has been sent. Don't forget to also check your junk mail box.",
                        })
                        .onDismiss(() => {
                            this.$emit('ok', this.email);
                            this.hide();
                        });
                })
                .catch((error) => (this.errorMessage = error.message));
        },
    },
});
</script>
