'use strict';

const Excel = require('exceljs');

module.exports = function ( filename ) {
    return new Promise(( resolve, reject ) => {
        let data = [];
        let workbook = new Excel.Workbook();
        workbook.xlsx.readFile(filename).then(( excel ) => {
            excel.eachSheet(( sheet, sheetNumber ) => {
                if (sheetNumber == 1) {
                    sheet.eachRow(( row, rowNumber ) => {
                        row.values.forEach(( value, index ) => {
                            if (index >= 1 && index <= 26) {
                                if (typeof value == 'object') {
                                    value = value.result;
                                }
                                data.push({
                                    key : `[${ String.fromCharCode(64 + index) }${ rowNumber }]`,
                                    value : `${ value }`,
                                });
                            }
                        });
                    });
                }
            });
        }).catch(reject);
        resolve(data);
    });
};

module.exports.test = function ( filename ) {
    console.log(`test excel ${ filename }`);
    let workbook = new Excel.Workbook();
    workbook.xlsx.readFile(filename).then(( excel ) => {
        console.log('excel read file success');
        excel.eachSheet((sheet, sheetNumber) => {
            console.log('Sheet Number ' + sheetNumber);
            console.log('Sheet Name ' + sheet.name);
            sheet.eachRow((row, rowNumber) => {
                console.log('Row Number ' + rowNumber);
                console.log('Row Value ' + JSON.stringify(row.values));
            });
        });
        console.log('done');
    }).catch(( err ) => console.log(err));
};
