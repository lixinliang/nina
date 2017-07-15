'use strict';

const path = require('path');
const { name } = require('./variable');
const { Tray, nativeImage } = require('electron');
const logo = nativeImage.createFromPath(path.join(__dirname, '../icon/logo-64x64.png'));

let tray;

module.exports = function ( win, ipc, sender ) {

    tray = new Tray(logo.resize({ width : 16, height : 16 }));
    tray.setToolTip(name);
    tray.on('click', () => {
        win.show();
    });

    ipc.async('drop-files', ( event ) => {
        let { send } = sender(event);
        tray.on('drop-files', ( event, files ) => {
            win.show();
            event.preventDefault();
            send('drop-files', {
                data : {
                    files,
                },
            });
        });
    });

};
