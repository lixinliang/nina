'use strict';

const fs = require('fs');
const path = require('path');
const { app } = require('electron');

const name = `${ app.getName().slice(0, 1).toUpperCase() }${ app.getName().slice(1).toLowerCase() }`;
const version = app.getVersion();

let copyright = '';

try {
    copyright = fs.readFileSync(path.join(__dirname, '../LICENSE'), 'utf8').split('\n')[2];
} catch (e) {

}

app.setAboutPanelOptions({
    version : '',
    copyright,
    applicationName : name,
    applicationVersion : version,
});

module.exports = {
    name,
    version,
};
