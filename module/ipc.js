'use strict';

const fs = require('fs');
const http = require('http');
const path = require('path');
const fse = require('fs-extra');
const generate = require('./generate.js');
const { ipcMain, shell } = require('electron');
const { name, version } = require('./variable');

module.exports = function ( win ) {

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

    ipc.sync('app-name', ( event ) => {
        event.returnValue = name;
    });

    ipc.sync('app-version', ( event ) => {
        event.returnValue = version;
    });

    ipc.sync('focus', ( event ) => {
        win.focus();
        event.returnValue = null;
    });

    ipc.async('open-folder', ( event, folder ) => {
        if (path.extname(folder) !== '') {
            folder = path.join(folder, '..');
        }
        fse.ensureDir(folder)
        .then(() => new Promise(( resolve, reject ) => {
            let success = shell.openItem(folder);
            if (success) {
                // noop
            } else {
                reject(new Error(`ENOENT: open folder failed, open '${ folder }'`));
            }
        })).then(() => {
            sender(event).send('open-folder', {});
        }).catch(( err ) => {
            let message = `${ err }`;
            sender(event).send('open-folder', {
                err : {
                    message,
                },
            });
        });
    });

    ipc.async('request-image', ( event ) => {
        let random = ( n ) => (parseInt(Math.random() * n) % n);
        let boolean = () => !!random(2);
        http.get(`http://placekitten.com/${ boolean() ? 300 : 400 }/${ boolean() ? 300 : 400 }?image=${ random(15) }`, ( res ) => {
            let chunk = [];
            let size = 0;
            res.on('data', ( data ) => {
                chunk.push(data);
                size += data.length;
            });
            res.on('end', () => {
                let data = `data:${ res.headers['content-type'] };base64,${ Buffer.concat(chunk, size).toString('base64') }`;
                sender(event).send('request-image', { data });
            });
        });
    });

    ipc.async('generate-ppt', ( event, paths ) => {
        generate(paths, ( payload ) => {
            sender(event).send('generate-ppt', payload);
        });
    });

    return {
        ipc,
        sender,
    };
}
