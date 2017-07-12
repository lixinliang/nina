#!/usr/bin/env node

'use strict';

const fs = require('fs');
const path = require('path');
const shelljs = require('shelljs');
const program = require('commander');

program
    .option('run', 'Run app')
    .option('build', 'Build app')
    .parse(process.argv);

let folder = '/Users/lixinliang/GitHub/nina/';

if (program.run) {
    shelljs.cd(folder);
    shelljs.exec('electron .');
}

if (program.build) {
    let dest = '/Users/lixinliang/Desktop/';
    shelljs.cd(folder);
    shelljs.exec(`electron-packager . Nina --platform=darwin --arch=x64 --overwrite --out=${ dest } --icon=./icon/logo.png --ignore='(.DS_Store)' --electron-version 1.4.12 && open ${ dest }`);
}
