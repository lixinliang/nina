import './base'
import app from './app';

window.vm = new Vue(app).$mount('app');

['Chrome', 'Electron', 'Node', 'V8'].forEach(( platform ) => {
    console.info(`${ platform }: ${ Vue.$process.versions[platform.toLowerCase()] }`);
});
