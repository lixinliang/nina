#!/usr/bin/env node

'use strict';

const fs = require('fs');
const path = require('path');
const shelljs = require('shelljs');
const program = require('commander');
const packager = require('/usr/local/lib/node_modules/electron-packager');

program
    .option('run', 'Run app')
    .option('build', 'Build app')
    .option('debug', 'Debug app')
    .parse(process.argv);

function main () {

    let folder = '/Users/lixinliang/GitHub/nina/';

    if (program.run) {
        shelljs.cd(folder);
        shelljs.exec('electron . --env=dev');
        return;
    }

    if (program.build) {
        let dest = '/Users/lixinliang/Desktop/';
        packager({
            'arch' : 'x64',
            'platform' : 'darwin',
            'dir' : `${ folder }`,
            'out' : `${ dest }`,
            'icon' : `${ path.join(folder, './icon/logo.icns') }`,
            'ignore' : ['.DS_Store'],
            'overwrite' : true,
            'electronVersion' : '1.4.12',
            'appCopyright' : 'Copyright (c) 2017 lixinliang',
            'version-string':{
                'ProductName' : 'Nina',
                'InternalName' : 'Nina',
                'OriginalFilename' : 'Nina',
                'CompanyName' : 'lixinliang',
                'FileDescription' : 'Nina Tool Desktop',
            },
        }, ( err ) => {
            if (err) {
                console.log(err);
                return;
            }
            shelljs.exec(`open ${ dest }`);
        });
        return;
        // shelljs.cd(folder);
        // shelljs.exec(`electron-packager . Nina --platform=darwin --arch=x64 --overwrite --out=${ dest } --icon=./icon/logo.png --ignore='(.DS_Store)' --electron-version 1.4.12 && open ${ dest }`);
    }

    if (program.debug) {
        shelljs.cd(folder);
        shelljs.exec(`osascript -e 'tell application "Terminal" to do script "node-inspector"'`);
        shelljs.exec(`open -a "Google Chrome" "http://127.0.0.1:8080/debug?ws=127.0.0.1:8080&port=5858"`);
        shelljs.exec('electron --debug-brk=5858 . --env=debug');
        return;
    }

    shelljs.exec('nina -h');
}

main();
