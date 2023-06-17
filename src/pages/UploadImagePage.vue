<template>
    <q-page class="flex flex-row">
        <template v-if="tasks.length === 0">
            <div class="flex full-width flex-center">
                <photo-select @files-selected="onFilesSelected" :maxSize="config.maxFileSize" />
            </div>
        </template>
        <template v-else>
            <q-list bordered class="full-width">
                <upload-item v-for="task in tasks" :key="task.id" :task="task" @remove="removeTask" />
            </q-list>
        </template>
    </q-page>
</template>

<script lang="ts">
import { defineComponent, Ref, ref } from 'vue';
import config from 'src/config/application.json';
import PhotoSelect from 'src/components/PhotoSelect.vue';
import FileObj from 'src/utils/FileObj';
import UploadTaskHandler, { TaskStage, UploadTask } from 'src/utils/TaskHandler';
import UploadItem from 'src/components/UploadItem.vue';

export default defineComponent({
    components: { PhotoSelect, UploadItem },
    setup() {
        const taskHandler = new UploadTaskHandler();
        const tasks: Ref<UploadTask[]> = ref([]);

        taskHandler.onTaskFinished = () => {
            const nextTask = tasks.value.find((t) => t.stage === TaskStage.PENDING);
            if (nextTask === undefined) return;

            taskHandler.startTask(nextTask);
        };

        return {
            config,
            tasks,
            taskHandler,
        };
    },
    methods: {
        onFilesSelected(files: FileObj[]) {
            files.forEach((f) => {
                const task = new UploadTask(f);
                this.tasks.push(task);
            });

            const firstTask = this.tasks.find(() => true);
            if (firstTask === undefined) return;

            this.taskHandler.startTask(firstTask);
        },
        removeTask(task: UploadTask) {
            const index = this.tasks.findIndex((t) => t.id === task.id);
            if (index < 0) return;
            this.tasks.splice(index, 1);
        },
    },
    computed: {},
});
</script>
