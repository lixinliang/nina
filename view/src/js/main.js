import router from './component/router';

let vm = new Vue({
    router,
    render (h) {
        return (
            <div id="app" ref="app">
                <router-view ref="router-view"></router-view>
            </div>
        );
    },
});

vm.$mount('app');

window.vm = vm;

// console.log('Node: ', process.versions.node);
// console.log('Chrome: ', process.versions.chrome);
// console.log('Electron: ', process.versions.electron);

// const process = window['process'];
//
// console.log(typeof process);
//
// export default process;
