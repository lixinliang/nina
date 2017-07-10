#!/usr/bin/env node

'use strict';

const fs = require('fs');
const path = require('path');
const shelljs = require('shelljs');
const program = require('commander');

program
    .option('run', 'Run app')
    .parse(process.argv);

let folder = '/Users/lixinliang/GitHub/nina/';

if (program.run) {
    shelljs.cd(folder);
    shelljs.exec('electron .');
}