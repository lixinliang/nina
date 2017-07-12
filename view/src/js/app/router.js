import home from './home';

const routes = [
    {
        path : '/home',
        component : home,
    },
    {
        path : '/',
        redirect : '/home',
    },
];

const router = new VueRouter({
  routes,
});

export default router;
