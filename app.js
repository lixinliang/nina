'use strict';

const url = require('url');
const path = require('path');
const { argv } = require('yargs');
const { app, BrowserWindow } = require('electron');
const { createTray, createMenu, createIPC } = require('./module/index.js');

const release = 'release';
const env = argv.env || release;

let win;

function createWindow () {

    win = new BrowserWindow({
        width : 300,
        height : 300,
        show : false,
        resizable : false,
        fullscreenable : false,
        titleBarStyle : 'hidden',
    });

    if (env == release) {
        win.loadURL(url.format({
            slashes : true,
            protocol : 'file:',
            pathname : path.join(__dirname, 'view/dist/_index.html'),
        }));
    } else {
        // win.loadURL(`http://172.26.128.101:3001/_index.html`);
        win.loadURL(`http://192.168.1.110:3000/_index.html`);
        // win.webContents.openDevTools();
    }

    win.once('ready-to-show', () => win.show());

    win.on('closed', () => win = null);

    let { ipc, sender } = createIPC(win);

    createTray(win, ipc, sender);

    createMenu();

}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', () => app.quit());

app.on('activate', () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (win === null) {
        createWindow();
    }
});
