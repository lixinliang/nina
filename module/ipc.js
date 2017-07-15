'use strict';

const fs = require('fs');
const http = require('http');
const path = require('path');
const fse = require('fs-extra');
const ppt = require('./ppt');
const excel = require('./excel');
const { ipcMain, shell } = require('electron');
const { name, version } = require('./variable');

let parse = {
    ppt,
    excel,
};

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
        const [ excel, ppt, output ] = paths;
        let error = ( err ) => {
            let message = `${ err }`;
            console.log(message);
            sender(event).send('generate-ppt', {
                err : {
                    message,
                },
            });
        };
        let exists = ( file ) =>
            new Promise(( resolve, reject ) =>
                fs.exists(file, ( exists ) => {
                    if (exists) return resolve(true);
                    reject(new Error(`Error: ENOENT: no such file or directory, open '${ file }'`));
                })
            )
        ;
        Promise.all([
            exists(excel),
            exists(ppt),
        ]).then(() => fse.ensureDir(output))
        .then(() => parse.excel(excel))
        .then(( data ) => {
            // TODO:
            console.log(data);
            sender(event).send('generate-ppt', {});
        }).catch(error);
    });

    return {
        ipc,
        sender,
    };
}
