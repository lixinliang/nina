'use strict';

const path = require('path');
const { app, nativeImage } = require('electron');

const name = `${ app.getName().slice(0, 1).toUpperCase() }${ app.getName().slice(1).toLowerCase() }`;
const version = app.getVersion();
const logo = nativeImage.createFromPath(path.join(__dirname, '../icon/logo.png'));

console.log(path.join(__dirname, './icon/logo.png'));

module.exports = {
    name,
    version,
    logo,
};
