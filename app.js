'use strict';

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

const { app, BrowserWindow, Menu } = require('electron');
const path = require('path');
const url = require('url');

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win;

function createWindow () {
    // Create the browser window.
    win = new BrowserWindow({
        width : 300,
        height : 300,
        titleBarStyle : 'hidden',
    });

    // and load the index.html of the app.
    // win.loadURL(url.format({
    //     pathname : path.join(__dirname, 'view/dist/_index.html'),
    //     protocol : 'file:',
    //     slashes : true,
    // }));

    win.loadURL('http://192.168.1.110:3000/_index.html');
    win.loadURL('http://172.26.128.101:3001//_index.html');

    // Open the DevTools.
    // win.webContents.openDevTools()

    // Emitted when the window is closed.
    win.on('closed', () => {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        win = null;
    });

    win.setResizable(false);

    win.setSize(300, 300);
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

const Name = app.getName();

// Menu.setApplicationMenu(Menu.buildFromTemplate([
//     {
//         label : Name,
//         submenu : [
//             {
//                 label : `关于 ${ Name }`,
//                 role : 'about',
//                 // click () {
//                 //     console.log(123);
//                 // },
//             },
//             {
//                 label : `隐藏 ${ Name }`,
//                 role : 'hide',
//                 // accelerator : 'CmdOrAlt+H',
//             },
//             {
//                 label : `退出 ${ Name }`,
//                 role : 'quit',
//                 // accelerator : 'CmdOrAlt+Q',
//             },
//         ],
//     },
//     {
//         label : 'Edit',
//         submenu : [
//             {
//                 role : 'undo',
//             },
//             {
//                 role : 'redo',
//             },
//             {
//                 type: 'separator'
//             },
//             {
//                 role : 'cut',
//             },
//             {
//                 role : 'copy',
//             },
//             {
//                 role : 'paste',
//             },
//             {
//                 role : 'pasteandmatchstyle',
//             },
//             {
//                 role : 'delete',
//             },
//             {
//                 role : 'selectall',
//             },
//         ],
//     },
//     {
//         label : 'View',
//         submenu : [
//             {
//                 role : 'reload',
//             },
//             {
//                 role : 'forcereload',
//             },
//             {
//                 role : 'toggledevtools',
//             },
//             {
//                 type: 'separator'
//             },
//             {
//                 role : 'resetzoom',
//             },
//             {
//                 role : 'zoomin',
//             },
//             {
//                 role : 'zoomout',
//             },
//             {
//                 type: 'separator'
//             },
//             {
//                 role : 'togglefullscreen',
//             },
//         ],
//     },
//     {
//         role : 'window',
//         submenu : [
//             {
//                 role : 'minimize',
//             },
//             {
//                 role : 'close',
//             },
//         ],
//     },
//     {
//         role : 'help',
//         submenu : [
//             {
//                 label : 'Learn More',
//                 click () {
//                     require('electron').shell.openExternal('https://electron.atom.io');
//                 },
//             },
//         ],
//     },
// ]));
