import app from './app';

window.vm = new Vue(app).$mount('app');

// console.log('Node: ', process.versions.node);
// console.log('Chrome: ', process.versions.chrome);
// console.log('Electron: ', process.versions.electron);

// const process = window['process'];
//
// console.log(typeof process);
//
// export default process;
