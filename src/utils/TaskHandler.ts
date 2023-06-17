import FileObj from 'src/utils/FileObj';
import { v4 as uuid } from 'uuid';
import _sodium from 'libsodium-wrappers';
import { useFirebaseStore } from 'src/stores/firebase-store';
import { Buffer } from 'buffer';
import { ref as pathRef, UploadResult, uploadString } from 'firebase/storage';
import { usePublicKeyManager } from './PublicKeyManager';

export enum TaskStage {
    PENDING,
    READING,
    ENCRYPTING,
    UPLOADING,
    DONE,
}

export class UploadTask {
    readonly id: string = uuid();
    readonly file: FileObj;

    stage: TaskStage = TaskStage.PENDING;
    bytesRead = 0;

    isError = false;
    errorMessage = '';

    constructor(file: FileObj) {
        this.file = file;
    }
}

interface EncryptedFiledata {
    key: Uint8Array;
    nonce: Uint8Array;
    data: Uint8Array;
    checksum: Uint8Array;
}

const encodeBase64 = (data: string | ArrayBuffer): string => {
    return Buffer.from(data).toString('base64');
};

const createEncryptedMessage = (bytes: string | ArrayBuffer): EncryptedFiledata => {
    const nonce = _sodium.randombytes_buf(_sodium.crypto_secretbox_NONCEBYTES);
    const key = _sodium.crypto_secretstream_xchacha20poly1305_keygen();

    const hexdata = encodeBase64(bytes);

    const encrypted_data = _sodium.crypto_secretbox_easy(hexdata, nonce, key);
    const checksum = _sodium.crypto_generichash(32, hexdata);

    return {
        key: key,
        nonce,
        data: encrypted_data,
        checksum: checksum,
    };
};

const webEncodeMessage = (message: object): string => {
    const messageKeys = Object.keys(message);
    const result: { [key: string]: string } = {};

    messageKeys.forEach((key) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const value = (message as any)[key];
        result[key] = encodeBase64(value);
    });

    return JSON.stringify(result);
};

export default class UploadTaskHandler {
    readFile(task: UploadTask): Promise<string | ArrayBuffer | null> {
        task.stage = TaskStage.READING;
        console.debug('fase-read');
        return new Promise((resolve, reject) => {
            const reader = new FileReader();

            reader.onload = async (event) => {
                console.debug('read-finished');
                task.bytesRead = event.loaded;

                resolve(reader.result);
            };

            reader.onloadstart = (event) => {
                console.debug('read-progress');
                task.bytesRead = event.loaded;
            };

            reader.onprogress = (event) => {
                console.debug('read-progress');
                task.bytesRead = event.loaded;
            };

            reader.onerror = () => {
                console.debug('read-error');
                task.errorMessage = reader.error?.message ?? 'Error reading file.';
                reject();
            };

            reader.abort = () => {
                console.debug('read-error');
                task.errorMessage = 'Aborted';
                reject();
            };

            // Spark the read
            reader.readAsArrayBuffer(task.file.blob);
        });
    }

    async encryptFile(task: UploadTask, data: string | ArrayBuffer): Promise<string> {
        task.stage = TaskStage.ENCRYPTING;
        console.debug('fase-encrypt');
        return new Promise(async (resolve, reject) => {
            try {
                const publicKeyManager = usePublicKeyManager();

                console.debug('encrypt-create-message');
                const encryptedFile = createEncryptedMessage(data);
                console.debug('encrypt-secure-key');
                encryptedFile.key = await publicKeyManager.encrypt(encryptedFile.key);
                console.debug('encrypt-encode');
                const webMessage = webEncodeMessage(encryptedFile);

                console.debug('encrypt-done');
                resolve(webMessage);
            } catch (error) {
                console.error(error);
                reject(error);
            }
        });
    }

    async pushFile(task: UploadTask, data: string): Promise<UploadResult> {
        task.stage = TaskStage.UPLOADING;
        const firebaseStore = useFirebaseStore();
        const publicKeyManager = usePublicKeyManager();

        const storage = firebaseStore.storage;
        const filename = uuid() + '.blob';
        const file = pathRef(storage, 'uploads/' + filename);

        const keyId = (await publicKeyManager.publicKey).keyId;

        return uploadString(file, data, undefined, { customMetadata: { uploader: firebaseStore.user?.uid ?? 'unknown', lastModified: task.file.blob.lastModified.toString(), comment: task.file.comment, keyId }, contentType: task.file.blob.type });
    }

    async run(task: UploadTask): Promise<void> {
        const fileData = await this.readFile(task);
        if (fileData == null) throw new Error('Cannot read file');
        const webMessage = await this.encryptFile(task, fileData);

        await this.pushFile(task, webMessage);

        task.stage = TaskStage.DONE;
    }

    startTask(task: UploadTask) {
        this.run(task)
            .then(() => this.fireTaskFinished(task))
            .catch((reason) => {
                task.isError = true;
                task.errorMessage = reason?.message ?? 'onbekend';
                this.fireTaskFinished(task);
            });
    }

    fireTaskFinished(task: UploadTask) {
        this.onTaskFinished?.apply(this, [task]);
    }

    onTaskFinished?: (task: UploadTask) => void;

    constructor() {
        this.startTask = this.startTask.bind(this);
        this.encryptFile = this.encryptFile.bind(this);
        this.fireTaskFinished = this.fireTaskFinished.bind(this);
        this.pushFile = this.pushFile.bind(this);
        this.readFile = this.readFile.bind(this);
        this.run = this.run.bind(this);
    }
}
