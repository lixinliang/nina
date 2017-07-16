'use strict';

const { name } = require('./variable');
const { Menu, shell } = require('electron');

module.exports = function () {
    Menu.setApplicationMenu(Menu.buildFromTemplate(
        [
            {
                label : name,
                submenu : [
                    {
                        role : 'about',
                    },
                    {
                        type : 'separator',
                    },
                    {
                        role : 'services',
                        submenu : [],
                    },
                    {
                        type : 'separator',
                    },
                    {
                        role : 'hide',
                    },
                    {
                        role : 'hideothers',
                    },
                    {
                        role : 'unhide',
                    },
                    {
                        type : 'separator',
                    },
                    {
                        role : 'quit',
                    },
                ],
            },
            {
                label : 'Edit',
                submenu : [
                    {
                        role : 'undo',
                    },
                    {
                        role : 'redo',
                    },
                    {
                        type : 'separator',
                    },
                    {
                        role : 'cut',
                    },
                    {
                        role : 'copy',
                    },
                    {
                        role : 'paste',
                    },
                    {
                        role : 'pasteandmatchstyle',
                    },
                    {
                        role : 'delete',
                    },
                    {
                        role : 'selectall',
                    },
                ],
            },
            // {
            //     label : 'View',
            //     submenu : [
            //         {
            //             role : 'reload',
            //         },
            //         {
            //             role : 'toggledevtools',
            //         },
            //     ],
            // },
            // {
            //     role : 'window',
            //     submenu : [
            //         {
            //             label : 'Close',
            //             accelerator : 'CmdOrCtrl+W',
            //             role : 'close',
            //         },
            //         {
            //             label : 'Minimize',
            //             accelerator : 'CmdOrCtrl+M',
            //             role : 'minimize',
            //         },
            //     ],
            // },
            {
                role : 'help',
                submenu : [
                    {
                    label : 'Issue',
                    click () {
                        shell.openExternal('https://github.com/lixinliang/nina/issues');
                    },
                }, ],
            },
        ]
    ));
};
