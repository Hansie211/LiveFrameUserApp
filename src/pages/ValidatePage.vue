<template>
    <q-page padding class="flex flex-center">
        <div id="validate-box" class="flex column q-gutter-y-lg" style="width: 100%">
            <div class="text-h3">Uitnodiging</div>
            <!-- <div class="text-h6">Voer hieronder de {{ codeSize }} cijfers in van de uitnodigingscode</div> -->
            <error-notification ref="alert" />
            <input-row :chunk-size="codeChunkSize" :size="codeSize" ref="input-row" @input="(v) => (code = v)" />
            <q-btn color="primary" label="Versturen" @click="submitCode" class="full-width q-mt-lg" size="lg" :disable="!isCodeComplete" />

            <code-keyboard @input="(v) => inputBox.addNumber(v)" @delete="() => inputBox.removeNumber()" />
        </div>
    </q-page>
</template>

<script lang="ts">
import { collection, doc, setDoc } from '@firebase/firestore';
import ErrorNotification from 'src/components/ErrorNotification.vue';
import CodeKeyboard from 'src/components/CodeKeyboard.vue';
import InputRow from 'src/components/InputRow.vue';
import { useFirebaseStore } from 'src/stores/firebase-store';
import { defineComponent } from 'vue';

export default defineComponent({
    components: { ErrorNotification, CodeKeyboard, InputRow },
    setup() {
        const firebaseStore = useFirebaseStore();
        return {
            codeSize: 12,
            codeChunkSize: 4,
            firebaseStore,
        };
    },
    data() {
        return {
            code: '',
        };
    },
    computed: {
        isCodeComplete() {
            return this.code.length === this.codeSize;
        },
        refs() {
            return this.$refs as { [key: string]: object };
        },
        alertBox() {
            interface result {
                show: (title: string, message: string) => void;
            }
            return this.refs['alert'] as result;
        },
        inputBox() {
            interface result {
                addNumber: (v: number) => void;
                removeNumber: () => void;
            }
            return this.refs['input-row'] as result;
        },
    },
    methods: {
        async submitCode() {
            if (!this.isCodeComplete) return;
            try {
                const folder = collection(this.firebaseStore.database, 'validated_users');
                const file = doc(folder, this.firebaseStore.user?.uid);

                await setDoc(file, {
                    'invitation-code': this.code,
                });

                this.$router.push({ name: 'UploadImagePage' });
            } catch (error) {
                this.alertBox.show('Let op!', 'Code niet bekend. Controleer de code en probeer het later nogmaals.');
            }
        },
    },
});
</script>
