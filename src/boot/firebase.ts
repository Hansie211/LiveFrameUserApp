import { boot } from 'quasar/wrappers';
import firebaseOptions from 'src/config/firebase.json';
import { useFirebaseStore } from 'src/stores/firebase-store';

export default boot(() => {
    const firebaseStore = useFirebaseStore();
    firebaseStore.initialize(firebaseOptions);
});
