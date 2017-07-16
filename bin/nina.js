#!/usr/bin/env node

'use strict';

const fs = require('fs');
const path = require('path');
const fse = require('fs-extra');
const shelljs = require('shelljs');
const program = require('commander');
const packager = require('/usr/local/lib/node_modules/electron-packager');

program
    .option('run', 'Run app')
    .option('build', 'Build app')
    .option('debug', 'Debug app')
    .option('test', 'Test generate')
    .parse(process.argv);

function main () {

    let folder = path.join(__dirname, '..');

    if (program.run) {
        shelljs.cd(folder);
        shelljs.exec('electron . --env=dev');
        return;
    }

    if (program.build) {
        let dest = path.join(folder, 'dest');
        fse.ensureDir(dest).then(() => {
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
        });
        return;
    }

    if (program.debug) {
        shelljs.cd(folder);
        shelljs.exec(`osascript -e 'tell application "Terminal" to do script "node-inspector"'`);
        shelljs.exec(`open -a "Google Chrome" "http://127.0.0.1:8080/debug?ws=127.0.0.1:8080&port=5858"`);
        shelljs.exec('electron --debug-brk=5858 . --env=debug');
        return;
    }

    if (program.test) {
        // const generate = require('../module/generate.js');
        // let type = program.args[0];
        // if (type == 'excel') {
        //     generate.test.excel.test(path.join(folder, 'test/test-excel.xlsx'));
        //     return;
        // }
        // if (type == 'ppt') {
        //     generate.test.ppt.test(
        //         path.join(folder, 'test/test-ppt.pptx'),
        //         path.join(folder, 'test/output')
        //     );
        //     return;
        // }
        // generate([
        //     path.join(folder, 'test/test.xlsx'),
        //     path.join(folder, 'test/test.pptx'),
        //     path.join(folder, 'test/output'),
        // ], ({ err }) => {
        //     err && console.log(err);
        // });
        return;
    }

    shelljs.exec('nina -h');
}

main();
