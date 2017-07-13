<script>
// const ipc = require('ipc');

export default {
    data () {
        return {
            test : process.env == 'dev',
        };
    },
    methods : {
        click () {
            // ipc.send('test', 'test');
        },
    },
};
</script>

<template>
    <div class="home" @click="click">home {{ test }}</div>
</template>

<style lang="scss" scoped>
    .home {
        width: 100%;
        height: 100%;
        padding-top: 25px;
        overflow: hidden;
        position: relative;
        text-align: center;
        font-size: 20px;
        line-height: 1.5;
        word-wrap: break-word;
        word-break: break-all;
    }
</style>
