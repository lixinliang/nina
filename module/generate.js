'use strict';

const fs = require('fs');
const path = require('path');
const ppt = require('./ppt');
const fse = require('fs-extra');
const excel = require('./excel');

let parse = {
    ppt,
    excel,
};

module.exports = function ( paths, receiver ) {
    const [ excel, ppt, output ] = paths;
    let error = ( err ) => {
        let message = `${ err }`;
        receiver({
            err : {
                message,
            },
        });
    };
    let exists = ( file ) =>
        new Promise(( resolve, reject ) =>
            fs.exists(file, ( exists ) => {
                if (exists) return resolve(true);
                reject(new Error(`Error: ENOENT: no such file or directory, open '${ file }'`));
            })
        )
    ;
    Promise.all([
        exists(excel),
        exists(ppt),
    ]).then(() => fse.ensureDir(output))
    .then(() => parse.excel(excel))
    .then(( excel ) => parse.ppt(excel, ppt, output))
    .then(() => receiver({}))
    .catch(error);
}

module.exports.test = parse;
