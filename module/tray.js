'use strict';

const { Tray } = require('electron');
const { name, logo } = require('./variable');

let tray;

module.exports = function ( win ) {

    tray = new Tray(logo.resize({ width : 16, height : 16 }));
    tray.setToolTip(name);
    tray.on('click', () => {
        win.show();
    });
    tray.on('drop-files', ( event, files ) => {
        win.show();
        event.preventDefault();
        console.log(event, files);
    });

};
