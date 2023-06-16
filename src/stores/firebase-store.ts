import { FirebaseApp, FirebaseOptions, initializeApp } from 'firebase/app';
import { Auth, getAuth, User } from 'firebase/auth';
import { doc, Firestore, getDoc, getFirestore } from 'firebase/firestore';
import { FirebaseStorage, getStorage } from 'firebase/storage';
import { defineStore } from 'pinia';
import { Ref, ref } from 'vue';

interface Awaiter<T> {
    resolveFn: (value: T) => void;
    rejectFn: (value?: unknown) => void;

    promise: Promise<T>;
}

function buildAwaiter<T>(): Awaiter<T> {
    const result: Awaiter<T> = {} as Awaiter<T>;

    result.promise = new Promise((resolve, reject) => {
        result.resolveFn = resolve;
        result.rejectFn = reject;
    });

    return result;
}

export const useFirebaseStore = defineStore('firebaseStore', () => {
    const app: Ref<FirebaseApp> = ref() as Ref<FirebaseApp>;
    const authentication: Ref<Auth> = ref() as Ref<Auth>;
    const user: Ref<User | undefined> = ref(undefined);
    const database: Ref<Firestore> = ref() as Ref<Firestore>;
    const storage: Ref<FirebaseStorage> = ref() as Ref<FirebaseStorage>;

    const authorizedUserWaiter = buildAwaiter<User | undefined>();

    const initialize = (options: FirebaseOptions): void => {
        app.value = initializeApp(options);
        authentication.value = getAuth(app.value);
        database.value = getFirestore(app.value);
        storage.value = getStorage(app.value);

        const unsubscribe = authentication.value.onAuthStateChanged((userValue) => {
            unsubscribe();

            console.debug('Found user', userValue?.displayName ?? '<unknown>');

            user.value = userValue ?? undefined;
            authorizedUserWaiter.resolveFn(user.value);
        }, authorizedUserWaiter.rejectFn);
    };

    const hasUser = (): boolean => !!user.value;

    const isUserValidated = async (): Promise<boolean> => {
        if (!user.value) return false;

        console.debug('Download validation snapshot...');
        try {
            const docRef = doc(database.value, 'validated_users', user.value.uid);
            const snapshot = await getDoc(docRef);
            console.debug('Retrieved validation snapshot ✔️');
            if (snapshot.exists()) {
                return true;
            } else {
                return false;
            }
        } catch {
            return false;
        }
    };

    const waitForAuthorizedUser = async (): Promise<void> => {
        await authorizedUserWaiter.promise;
    };

    return {
        app,
        authentication,
        user,
        database,
        storage,
        initialize,
        hasUser,
        isUserValidated,
        waitForAuthorizedUser,
    };
});
