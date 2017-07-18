<script>
import store from './store';
import router from './router';
import statusbar from './statusbar';

export default {
    store,
    router,
    components : {
        statusbar,
    },
};
</script>

<template>
    <div id="app" ref="app">
        <statusbar></statusbar>
        <router-view ref="router-view"></router-view>
    </div>
</template>

<style lang="scss" scoped>
    #app {
        width: 100%;
        height: 100%;
    }
</style>
