'use strict';

const url = require('url');
const path = require('path');
const { argv } = require('yargs');
const { createTray, createMenu } = require('./module/index.js');
const { app, BrowserWindow } = require('electron');

const release = 'release';
const env = argv.env || release;

let win;

function createWindow () {

    win = new BrowserWindow({
        width : 300,
        height : 300,
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
        win.loadURL(`http://172.26.128.101:3001/_index.html`);
    }

    // Emitted when the window is closed.
    win.on('closed', () => {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        win = null;
    });

    createTray(win);

    createMenu();

    const { webContents } = win;

    webContents.send('electron:log', '123');

}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', () => {
    // On macOS it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (win === null) {
        createWindow();
    }
});

// const fs = require('fs');
// const path = require('path');
// const Excel = require('exceljs');
// const { app, BrowserWindow } = require('electron');

// var filename = path.join(__dirname, './test.xlsx');

// var workbook = new Excel.Workbook();
// workbook.xlsx.readFile(filename).then(function ( excel ) {
//     excel.eachSheet(function(sheet, sheetNumber) {
//         console.log('Sheet Number ' + sheetNumber);
//         console.log('Sheet Name ' + sheet.name);
//         sheet.eachRow(function(row, rowNumber) {
//             console.log('Row Number ' + rowNumber);
//             console.log('Row Value ' + JSON.stringify(row.values));
//         });
//     });
// });



// ipcMain.on('ondragstart', ( event, filePath ) => {
//     console.log(123);
//     // event.sender.startDrag({
//     //     file: filePath,
//     //     icon: '/path/to/icon.png'
//     // });
// });

//
