
import { API_GMT, API_TIME_FORMAT } from '../config';
import { padString } from './string.helper';

export function extendDateClass() {
    Date.prototype.yyyymmdd = function (split = '') {
        var mm = this.getMonth() + 1; // getMonth() is zero-based
        var dd = this.getDate();

        return [this.getFullYear(),
        (mm > 9 ? '' : '0') + mm,
        (dd > 9 ? '' : '0') + dd
        ].join(split);
    };
    Date.prototype.ddmmyyyy = function (split = '') {
        var mm = this.getMonth() + 1; // getMonth() is zero-based
        var dd = this.getDate();

        return [this.getFullYear(),
        (mm > 9 ? '' : '0') + mm,
        (dd > 9 ? '' : '0') + dd
        ].reverse().join(split);
    };
    Date.prototype.restDays = function (days) {
        var date = new Date(this.valueOf());
        date.setDate(date.getDate() - days);
        return date;
    }
    Date.prototype.addDays = function (days) {
        var date = new Date(this.valueOf());
        date.setDate(date.getDate() + days);
        return date;
    }
}

export function serverTime(date, gmt = null) {
    let d = new Date(date);
    let utc = d.getTime() + (d.getTimezoneOffset() * 60000);
    let nd = new Date(utc + (3600000 * (gmt || API_GMT)));
    return nd;
}
export function getDateTimeText() {
    const serverDate = serverTime(new Date);
    const dateText = serverDate.toISOString().split("T")[0].split('-').reverse().join('-');
    const timeText = serverDate.toLocaleTimeString().replace(/(\..*)/gi, '').replace(/\:/gi, '');
    return dateText + '_' + timeText;
}
export function convertStringToDate(strDate, format, split = '/') {
    const newDate = (day, month, year) => (
        new Date([month, day, year].join(split))
    )
    const valueDate1 = (date) => {
        const [day, month, year] = date.split(split);
        return newDate(day, month, year);
    }
    const valueDate2 = (date) => {
        const [month, day, year] = date.split(split);
        return newDate(day, month, year);
    }
    const valueDate3 = (date) => {
        const [year, month, day] = date.split(split);
        return newDate(day, month, year);
    }
    switch (format) {
        case 'DD/MM/YYYY': {
            return valueDate1(strDate);
        }
        case 'MM/DD/YYYY': {
            return valueDate2(strDate);
        }
        case 'YYYY/MM/DD': {
            return valueDate3(strDate);
        }
    }
}

export function isValidRange(dateFrom, dateTo, rangeDay = 0, format = 'DD/MM/YYYY', split = '/') {
    let dateF, dateT, rest;
    const rangeTime = rangeDay * 60 * 60 * 24 * 1000;
    const formats = ['DD/MM/YYYY', 'MM/DD/YYYY', 'YYYY/MM/DD'];

    if (formats.indexOf(format) !== -1) {
        dateF = convertStringToDate(dateFrom, format, split);
        dateT = convertStringToDate(dateTo, format, split);

        rest = dateT.getTime() - dateF.getTime();

        if (rest < 0) return false;
        if (rest <= rangeTime)
            return true;
        else return 'Rango no válido, solo se permiten ' + rangeDay + ' ' + (rangeDay === 1 ? 'día' : 'días');
    } else return false;
}

export function isDateFormat(format, value) {
    try {
        let hasFormat = false;
        let withTime = false;
        let tempValue = value;
        let tempFormat = format;
        let token = '';

        const patternTimeValue = /\s.*(([0-5][0-9]+:([0-5][0-9])+:[0-9][0-9]+)+)/g;
        const patternFormatTime = /(\s{1,})?([hms]+:[hms]+:[hms]+)/g;

        if (patternFormatTime.test(format)) {
            tempFormat = format.replace(patternFormatTime, '');
        }
        if (patternTimeValue.test(value)) {
            tempValue = value.toString().replace(patternTimeValue, '');
            withTime = true;
        }
        if (format.includes('/')) {
            if ((/^([DMY]{2}([DMY]{2})?\/[DMY]{2}([DMY]{2})?\/[DMY]{2}([DMY]{2})?)(\s{1,})?([hms]|:)*$/gi).test(format) &&
                (tempValue.toString().replace(/\d{2,4}\/\d{2,4}\/\d{2,4}/g, '') === '')) { hasFormat = true; token = '/'; }
        } else if (format.includes('-')) {
            if ((/^([DMY]{2}([DMY]{2})?\-[DMY]{2}([DMY]{2})?\-[DMY]{2}([DMY]{2})?)(\s{1,})?([hms]|:)*$/gi).test(format) &&
                (tempValue.toString().replace(/\d{2,4}\-\d{2,4}\-\d{2,4}/g, '') === '')) { hasFormat = true; token = '-'; }
        }

        if (hasFormat) {
            let statusValue = true;
            const [formFirst, formSecond, formThird] = tempFormat.split(token);
            const [partFirst, partSecond, partThird] = tempValue.split(token);

            if (partFirst.length !== formFirst.length) { statusValue = false }
            if (partSecond.length !== formSecond.length) { statusValue = false }
            if (partThird.length !== formThird.length) { statusValue = false }

            let day = null, month = null, year = null;
            [[formFirst, partFirst], [formSecond, partSecond], [formThird, partThird]].map(([f, p]) => {
                if (f.includes('D')) { day = p }
                if (f.includes('M')) { month = p }
                if (f.includes('Y')) { year = p }
            });
            let date = (new Date(year, month, '0')).getDate() - 0;
            if (month > 12 || month < 1) { statusValue = false }
            if (((day - 0) > (isNaN(date) ? 0 : date)) || day < 1) { statusValue = false }

            if (withTime && !patternFormatTime.test(format)) {
                statusValue = false
            }

            return statusValue;
        } else { return false }
    } catch (e) { return false }
}

export function isTimeFormat(format, value) {
    if ((/^\d{1,2}\:\d{1,2}$/g).test(value)) {
        const getHours = parseInt(value.replace(/:\d{1,2}$/g, '') || '0', 10);
        if (getHours >= 0 && getHours <= 23) {
            return true;
        } else {
            return false;
        }
    } else {
        return false;
    }
}

export function convertExcelDateToJSDate(serial, format = false) {
    let output = {
        objectDate: { day: null, month: null, year: null, seconds: null, minutes: null, hours: null },
        stringDate: ''
    };
    if (serial === null || serial === undefined || serial === '' || serial === 0 || serial === '0') {
        if (format === API_TIME_FORMAT && (serial === 0 || serial === '0')) {
            output.stringDate = '00:00';
        } else {
            output.stringDate = serial;
        }
        return output;
    }
    if ((/\d{1,2}\/\d{1,2}\/\d{4}/g).test(serial)) {
        let tempDate = serial.split('/');
        output.stringDate = [padString(tempDate[0], 2), padString(tempDate[1], 2), tempDate[2]].join('/');
        return output;
    }
    if (format === 'hh:mm' && (/^\d{1,2}\:\d{1,2}$/g).test(serial)) {
        output.stringDate = serial;
        return output;
    } else {
        let utc_days = Math.floor(serial - 25569);
        let utc_value = utc_days * 86400;
        let date_info = serverTime(utc_value * 1000, '+0');

        if (date_info.toString() === 'Invalid Date') {
            output.stringDate = serial;
            return output;
        }
        let fractional_day = serial - (format === 'hh:mm' ? 0 : Math.floor(serial)) + 0.0000001;
        let total_seconds = Math.floor(86400 * fractional_day);
        let seconds = total_seconds % 60;
        total_seconds -= seconds;

        let hours = Math.floor(total_seconds / (60 * 60));
        let minutes = Math.floor(total_seconds / 60) % 60;

        let serverHours = hours;
        let serverMinuts = minutes;
        let serverSeconds = seconds;

        output = {
            objectDate: {
                day: padString(date_info.getDate(), 2),
                month: padString(date_info.getMonth() + 1, 2),
                year: date_info.getFullYear(),
                seconds: '00',
                minutes: '00',
                hours: '00'
            },
            stringDate: padString(date_info.getDate(), 2) + '/' + padString(date_info.getMonth() + 1, 2) + '/' + date_info.getFullYear()
        };

        if (!(serverHours === 0 && serverMinuts === 0 && serverSeconds === 0)) {
            output.seconds = padString(serverSeconds, 2)
            output.minutes = padString(serverMinuts, 2)
            output.hours = padString(serverHours, 2)
            output.stringDate = padString(date_info.getDate(), 2) + '/' + padString(date_info.getMonth() + 1, 2) + '/' + date_info.getFullYear() + ' ' + padString(serverHours, 2) + ':' + padString(serverMinuts, 2) + ':' + padString(serverSeconds, 2)

        }
        if (format === 'hh:mm') {
            output.stringDate = padString(serverHours, 2) + ':' + padString(serverMinuts, 2);
        }
        return output;
    }
}