<template>
    <q-item :active="taskIsActive">
        <q-item-section avatar top>
            <img :src="task.file.objectURL" style="width: 100px; height: 100px; object-fit: contain; object-position: center" />
        </q-item-section>

        <q-item-section top class="col-2 gt-sm">
            <q-item-label class="q-mt-sm">{{ task.file.blob.name }}</q-item-label>
            <q-item-label class="q-mt-sm">{{ task.file.comment }}</q-item-label>
        </q-item-section>

        <q-item-section top>
            <q-item-label lines="1">
                <span class="text-weight-medium">{{ getStageName(task.stage) }}</span>
            </q-item-label>
            <q-linear-progress :value="progress / 100" class="q-mt-md" />
            <q-circular-progress v-if="taskIsActive" indeterminate size="50px" color="lime" class="q-ma-md" />
        </q-item-section>

        <q-item-section top side>
            <div class="text-grey-8 q-gutter-xs">
                <q-btn size="12px" flat dense round icon="delete" v-if="taskIsPending" @click="() => $emit('remove', task)" />
                <q-btn size="12px" flat dense round icon="close" v-if="taskIsDone" @click="() => $emit('remove', task)" />
            </div>
        </q-item-section>
    </q-item>
</template>

<script lang="ts">
import { TaskStage, UploadTask } from 'src/utils/TaskHandler';
import { defineComponent } from 'vue';

export default defineComponent({
    props: {
        task: {
            type: UploadTask,
            required: true,
        },
    },
    emits: ['remove'],
    methods: {
        getStageName(state: TaskStage): string {
            switch (state) {
                case TaskStage.PENDING:
                    return 'Klaar voor verwerking';
                case TaskStage.READING:
                    return 'Bestand lezen...';
                case TaskStage.ENCRYPTING:
                    return 'Versleutelen...';
                case TaskStage.UPLOADING:
                    return 'Bestand uploaden...';
                case TaskStage.DONE:
                    return 'Afgerond';
                default:
                    return '??';
            }
        },
    },
    computed: {
        taskIsPending(): boolean {
            return this.task.stage === TaskStage.PENDING;
        },
        taskIsActive(): boolean {
            return !(this.taskIsPending || this.taskIsDone);
        },
        taskIsDone(): boolean {
            return this.task.stage === TaskStage.DONE;
        },
        progress(): number {
            switch (this.task.stage) {
                case TaskStage.PENDING:
                    return 0;
                case TaskStage.READING:
                    return 20;
                case TaskStage.ENCRYPTING:
                    return 60;
                case TaskStage.UPLOADING:
                    return 80;
                case TaskStage.DONE:
                    return 100;
                default:
                    return 0;
            }
        },
    },
});
</script>
