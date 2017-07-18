window.__require = window['require'];

const { ipcRenderer } = __require('electron');

function define ( key, value ) {
    Vue[`$${ key }`] = Vue.prototype[`$${ key }`] = value;
}

define('process', window['process']);

define('ipcRenderer', {
    on : (function() {
        let events = {};
        return function ( channel, callback ) {
            let emitter = events[channel];
            if (!emitter) {
                emitter = events[channel] = new Vue({});
                ipcRenderer.on(`reply:${ channel }`, ( event, response ) => {
                    emitter.$emit(channel, response);
                });
                ipcRenderer.send(`async:${ channel }`);
            }
            emitter.$on(channel, callback);
        };
    })(),
    send ( channel, ...args ) {
        return new Promise(( resolve ) => {
            ipcRenderer.once(`reply:${ channel }`, ( event, response ) => {
                resolve(response);
            });
            ipcRenderer.send(`async:${ channel }`, ...args);
        });
    },
    sendSync ( channel, ...args ) {
        return ipcRenderer.sendSync(`sync:${ channel }`, ...args);
    },
});

const name = Vue.$ipcRenderer.sendSync('app-name');

define('notify', ( body ) => {
    new Notification(name, { body });
});

define('error', ( err ) => {
    console.error(err);
    new Notification(name, { body : err.message });
});
