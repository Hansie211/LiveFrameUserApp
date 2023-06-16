import { useFirebaseStore } from 'src/stores/firebase-store';
import { getBytes, ref as pathRef } from 'firebase/storage';
import JSEncrypt from 'jsencrypt';
import { Buffer } from 'buffer';
import _sodium from 'libsodium-wrappers';

export interface PublicKey {
    data: string;
    keyId: string;
}

function getKeyId(key: string) {
    const keyData = key
        .replace(/(\r\n|\n|\r)/gm, '')
        .replace('-----BEGIN PUBLIC KEY-----', '')
        .replace('-----END PUBLIC KEY-----', '')
        .trim();
    return Buffer.from(_sodium.crypto_generichash(32, keyData)).toString('hex').toLocaleLowerCase();
}

export class PublicKeyManager {
    readonly publicKey: Promise<PublicKey> = new Promise(async (resolve, reject) => {
        console.debug('download public key');

        const firebaseStore = useFirebaseStore();

        const storage = firebaseStore.storage;
        const certFile = pathRef(storage, 'public.pem');

        getBytes(certFile)
            .then((bytes) => {
                const key = Buffer.from(bytes).toString('utf8');
                const keyId = getKeyId(key);

                console.debug('Retrieved public key', key);
                console.debug('Key id', keyId);

                resolve({
                    data: key,
                    keyId,
                });
            })
            .catch((reason) => {
                console.error('Cannot get public key', reason);
                reject(reason);
            });
    });

    readonly _JSEncrypt: Promise<JSEncrypt> = new Promise(async (resolve, reject) => {
        try {
            const key = await this.publicKey;
            const encrypt = new JSEncrypt();
            encrypt.setPublicKey(key.data);
            resolve(encrypt);
        } catch (reason) {
            reject(reason);
        }
    });

    encrypt(plainData: Uint8Array): Promise<Uint8Array> {
        return new Promise<Uint8Array>(async (resolve, reject) => {
            const encrypt = await this._JSEncrypt;

            const hexData = Buffer.from(plainData).toString('hex');
            const encryptedData = encrypt.encrypt(hexData);

            if (encryptedData === false) {
                reject('Cannot encrypt the key');
                return;
            }

            const encodedData = new Uint8Array(Buffer.from(encryptedData, 'base64').buffer);
            resolve(encodedData);
        });
    }

    constructor() {
        this.encrypt = this.encrypt.bind(this);
    }
}

const INSTANCE = new PublicKeyManager();
export const usePublicKeyManager: () => PublicKeyManager = () => INSTANCE;
