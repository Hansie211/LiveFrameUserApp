P
<template>
    <div class="full-width q-px-lg">
        <q-file class="q-mt-lg" ref="upload" v-model="model" @input="onFilesSelected" :max-file-size="maxSize" multiple v-show="false" accept="video/*, image/*" />
        <q-btn :label="label" icon="upload" @click="onClickSelect" class="full-width" color="primary" style="height: 3.5em" />
    </div>

    <q-dialog v-model="showDialog" persistent :maximized="true" transition-show="jump-up" transition-hide="slide-left">
        <div style="background-color: white">
            <div id="dialog-content" class="q-gutter-y-md q-pa-sm">
                <div class="flex row full-width">
                    <q-btn dense flat icon="close" @click="() => (showDialog = false)" />
                    <q-space />
                    <q-btn dense flat label="Sent" @click="onClickSent" />
                </div>
                <q-carousel style="height: 100%" swipeable animated v-model="slideIndex" ref="carousel" @update:model-value="() => componentRefs['descriptionBox'].focus()">
                    <q-carousel-slide v-for="(item, index) in files" :key="index" :name="index" class="q-pa-none">
                        <div class="full-width flex" style="height: 100%">
                            <video controls muted class="full-width" v-if="item.isVideo" :src="item.objectURL" />
                            <q-img class="full-width" :src="item.objectURL" v-if="item.isImage" fit="contain" style="max-height: 100%" />
                        </div>

                        <q-carousel-control position="bottom-right" :offset="[18, 18]" class="q-gutter-xs">
                            <q-btn push round dense color="orange" text-color="black" icon="arrow_left" @click="componentRefs['carousel'].previous()" :disable="slideIndex === 0" />
                            <q-btn push round dense color="orange" text-color="black" icon="arrow_right" @click="componentRefs['carousel'].next()" :disable="slideIndex === files.length - 1" />
                        </q-carousel-control>
                    </q-carousel-slide>
                </q-carousel>
                <div id="user-input">
                    <q-input v-if="files[slideIndex]" ref="descriptionBox" autofocus label="Opmerking" v-model="files[slideIndex].comment" />
                </div>
            </div>
        </div>
    </q-dialog>
</template>

<script lang="ts">
import { defineComponent, Ref, ref } from 'vue';
import FileObj from 'src/utils/FileObj';

export default defineComponent({
    props: {
        maxSize: {
            type: Number,
            default: undefined,
        },
        label: {
            type: String,
            default: 'Selecteer bestanden',
        },
    },
    emits: ['filesSelected'],
    setup() {
        const files: Ref<FileObj[]> = ref([]);
        return {
            model: ref(null),
            showDialog: ref(false),
            slideIndex: ref(0),
            files,
        };
    },
    methods: {
        onFilesSelected(event: Event) {
            const target = event.target as HTMLInputElement;
            const files: File[] = Array.from(target.files ?? []);
            if (!files.length) return;

            const tooLargeFiles: string[] = [];

            this.files = files
                .filter((file) => {
                    const correctSize = this.maxSize === undefined || file.size <= this.maxSize;
                    if (!correctSize) tooLargeFiles.push(file.name);
                    return correctSize;
                })
                .map((file) => {
                    const result = {
                        blob: file,
                        objectURL: URL.createObjectURL(file),
                        isVideo: file.type.toLowerCase().indexOf('video/') === 0,
                        isImage: file.type.toLowerCase().indexOf('image/') === 0,
                        comment: '',
                    };

                    return result;
                });

            files.forEach(() => this.upload.removeAtIndex(0));

            if (tooLargeFiles.length > 0) {
                alert(`Bestand\n${tooLargeFiles.join('\n')}\nis te groot.`);
            }

            if (this.files.length === 0) return;

            this.showDialog = true;
        },
        onClickSelect() {
            this.upload.pickFiles();
        },
        onClickSent() {
            if (this.files.length > 0) {
                this.$emit('filesSelected', [...this.files]);
            }
            this.showDialog = false;
        },
    },
    computed: {
        componentRefs() {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            return this.$refs as { [key: string]: any };
        },
        upload() {
            return this.componentRefs['upload'] as { removeAtIndex: (n: number) => void; pickFiles: () => void };
        },
    },
});
</script>
<style scoped>
#dialog-content {
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
}
</style>
