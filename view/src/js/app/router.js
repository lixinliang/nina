import home from './home';

const routes = [
    {
        path : '/home',
        component : home,
    },
    {
        path : '/',
        component : home,
    },
];

const router = new VueRouter({
  routes,
});

export default router;
