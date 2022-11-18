import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
/* import { APP_AUTHOR_EXCEL } from '../config/index'; */
export const EXTENTION_FILE = 'xlsx';
export const BIMARY_FILE = 'binary';
const APP_AUTHOR_EXCEL = () => ({
    Title   : "CARTONES - QS",
    Subject : "CARTONES - QS",
    Author  : "QUIMICA SUIZA",
    CreatedDate: new Date()
})
function s2ab(s) {
    var buf = new ArrayBuffer(s.length);
    var view = new Uint8Array(buf);
    for (var i = 0; i < s.length; i++) view[i] = s.charCodeAt(i) & 0xFF;
    return buf;
}

export function createExcelFile(namefile, pages) {
    try {
        let excelFile = XLSX.utils.book_new();
        excelFile.Props = APP_AUTHOR_EXCEL();
        for (const page of pages) {
            const { namePage, data, colswidth } = page;
            excelFile.SheetNames.push(namePage);
            excelFile.Sheets[namePage] = XLSX.utils.aoa_to_sheet(data)
            if (colswidth) {
                excelFile.Sheets[namePage]['!cols'] = colswidth;
            }
        }
        // var outFile = XLSX.write(excelFile, {bookType: EXTENTION_FILE,  type: BIMARY_FILE});
        // saveAs(new Blob([s2ab(outFile)],{ type:"application/octet-stream" }), namefile);
        XLSX.writeFile(excelFile, namefile);
        return true;
    } catch (err) {
        return false;
    }

}

export function readExcelFile(inputFiles, callback = () => { }) {
    const hojas = []
    const reader = new FileReader()
    try {
        const nameFile = inputFiles[0].name;
        reader.readAsArrayBuffer(inputFiles[0])
        reader.onloadend = (e) => {
            let data = new Uint8Array(e.target.result);
            let workbook = XLSX.read(data, { type: 'array' });

            workbook.SheetNames.forEach(function (sheetName) {
                let jsonExcel = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheetName]);
                let headers = getHeaders(workbook.Sheets[sheetName]);
                hojas.push({
                    data: jsonExcel,
                    headers: headers,
                    namePage: sheetName,
                    nameFile: nameFile
                });
            });
            callback(hojas);
        }
    } catch (err) {
        callback(hojas);
    }
}

/**
 * ------------------------
 * --- NUEVA ESTRUCTURA ---
 * ------------------------
 */
export function __readExcelFile(inputFiles, tblHeaders = []) {
    return new Promise((resolve) => {
        const hojas = []
        const reader = new FileReader()
        try {
            const nameFile = inputFiles[0].name;
            reader.onload = (e) => {
                let data = e.target.result;
                let workbook = XLSX.read(data, { type: 'binary', cellDates: true, cellText: false, cellNF: false });

                workbook.SheetNames.forEach(function (sheetName) {
                    const headers = getHeaders(workbook.Sheets[sheetName]);
                    const changeHeaders = changeSheetHeaders(headers, tblHeaders);
                    hojas.push({
                        data: XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], {
                            raw: false, dateNF: "DD/MM/YYYY HH:MM:SS",
                            range: 1,
                            blankRows: false,
                            defval: null,
                            header: changeHeaders,
                        }),
                        headers: headers,
                        namePage: sheetName,
                        nameFile: nameFile
                    });
                });
                resolve(hojas);
            }
            reader.onerror = (ex) => {
                resolve(hojas);
            };
            reader.readAsBinaryString(inputFiles[0]);
        } catch (err) {
            resolve(hojas);
        }
    })
}

function getHeaders(sheet) {
    let headers = [];
    if (sheet['!ref']) {
        const range = XLSX.utils.decode_range(sheet['!ref']);
        const R = range.s.r;
        for (let C = range.s.c; C <= range.e.c; ++C) {
            let cell = sheet[XLSX.utils.encode_cell({ c: C, r: R })]
            let hdr = "UNKNOWN " + C;
            if (cell && cell.t) {
                hdr = XLSX.utils.format_cell(cell);
                headers.push(hdr);
            }
        }
    }
    return headers;
}

function changeSheetHeaders(sheetHeader, tableHeader) {
    const hr = {};
    for (const head of tableHeader) { hr[head.label] = head; }
    for (const kh in sheetHeader) {
        if (sheetHeader.hasOwnProperty(kh)) {
            const header = sheetHeader[kh].trim().replace(/\s/gi, ' ');
            sheetHeader[kh] = hr[header] ? hr[header].id : '__UNKNOWN_' + header + '__';
        }
    }
    return sheetHeader;
}

function sleep(ms) {
    return new Promise(resolve => {
        const slp = setTimeout(() => {
            resolve();
            clearTimeout(slp);
        }, ms);
    })
}