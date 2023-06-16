import { route } from 'quasar/wrappers';
import { useFirebaseStore } from 'src/stores/firebase-store';
import { createMemoryHistory, createRouter, createWebHashHistory, createWebHistory, RouteRecordNormalized } from 'vue-router';
import routes from './routes';

/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Router instance.
 */

async function isAuthenticated() {
    const firebaseStore = useFirebaseStore();
    await firebaseStore.waitForAuthorizedUser();
    return firebaseStore.hasUser();
}

async function isValidated() {
    const firebaseStore = useFirebaseStore();
    await firebaseStore.waitForAuthorizedUser();
    return await firebaseStore.isUserValidated();
}

interface RequiredAuthorization {
    isMatch: (record: RouteRecordNormalized) => boolean;
    method: () => Promise<boolean>;
    redirectPage: string;
    name: string;
}

export default route(function (/* { store, ssrContext } */) {
    const createHistory = process.env.SERVER ? createMemoryHistory : process.env.VUE_ROUTER_MODE === 'history' ? createWebHistory : createWebHashHistory;

    const Router = createRouter({
        scrollBehavior: () => ({ left: 0, top: 0 }),
        routes,

        // Leave this as is and make changes in quasar.conf.js instead!
        // quasar.conf.js -> build -> vueRouterMode
        // quasar.conf.js -> build -> publicPath
        history: createHistory(process.env.MODE === 'ssr' ? void 0 : process.env.VUE_ROUTER_BASE),
    });

    Router.beforeEach(async (to, from, next) => {
        const requiredAuthorizations: Array<RequiredAuthorization> = [
            {
                isMatch: (record: RouteRecordNormalized) => record.meta.requireAuth === true,
                name: 'authentication',
                method: isAuthenticated,
                redirectPage: 'LoginPage',
            },
            {
                isMatch: (record: RouteRecordNormalized) => record.meta.requireValidation === true,
                name: 'validation',
                method: isValidated,
                redirectPage: 'ValidatePage',
            },
        ];

        for (let i = 0; i < requiredAuthorizations.length; i++) {
            const authorization = requiredAuthorizations[i];

            const isRequierd = to.matched.some(authorization.isMatch);
            if (!isRequierd) continue;

            console.debug('Page meta authorization required:', authorization.name);

            const hasAuthorization = await authorization.method();
            console.debug('hasAuthorization', authorization.name, hasAuthorization);

            if (!hasAuthorization) {
                console.debug('DENIED, REDIRECT');
                next({ name: authorization.redirectPage, query: { next: to.fullPath } });
                return;
            }
        }

        next();
    });

    return Router;
});
