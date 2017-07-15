'use strict';

const path = require('path');
const { app } = require('electron');

const name = `${ app.getName().slice(0, 1).toUpperCase() }${ app.getName().slice(1).toLowerCase() }`;
const version = app.getVersion();

module.exports = {
    name,
    version,
};
