import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
    {
        path: '/',
        component: () => import('layouts/MainLayout.vue'),
        children: [
            { path: '', component: () => import('pages/UploadImagePage.vue'), name: 'UploadImagePage', meta: { requireAuth: true, requireValidation: true } },
            { path: 'validate', component: () => import('pages/ValidatePage.vue'), name: 'ValidatePage', meta: { requireAuth: true } },
        ],
    },
    {
        path: '/login',
        component: () => import('layouts/EmptyLayout.vue'),
        children: [{ path: '', component: () => import('pages/LoginPage.vue'), name: 'LoginPage' }],
    },

    // Always leave this as last one,
    // but you can also remove it
    {
        path: '/:catchAll(.*)*',
        component: () => import('pages/ErrorNotFound.vue'),
    },
];

export default routes;
