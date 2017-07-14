'use strict';

const { name, version } = require('./variable');
const { ipcMain } = require('electron');

module.exports = function () {

    let ipc = {
        sync ( channel, listener ) {
            ipcMain.on(`sync:${ channel }`, listener);
        },
        async ( channel, listener ) {
            ipcMain.on(`async:${ channel }`, listener);
        },
    };
    let sender = ( event ) => {
        return {
            send ( channel, ...args ) {
                event.sender.send(`reply:${ channel }`, ...args);
            },
        };
    };

    ipc.async('generate-ppt', ( event, [ excel, ppt, output ] ) => {
        // TODO: logic
        console.log('excel > ', excel);
        console.log('ppt > ', ppt);
        console.log('output > ', output);
        let sleep = ( delay ) => new Promise(( resolve ) => setTimeout(resolve, delay));
        sleep(1000).then(() => {
            if (parseInt(Math.random() * 10) % 2) {
                sender(event).send('generate-ppt', {
                    err : null,
                });
            } else {
                sender(event).send('generate-ppt', {
                    err : {
                        message : '随机报错',
                    },
                });
            }
        });
    });

    ipc.sync('app-name', ( event ) => {
        event.returnValue = name;
    });

    ipc.sync('app-version', ( event ) => {
        event.returnValue = version;
    });

}
