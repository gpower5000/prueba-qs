import { isDateFormat, isTimeFormat } from './date.helper';

export function isEmpty(value) {
    if(value === null || value === undefined || value === '') {
        return true;
    }
    if(Array.isArray(value)) {
        if(value.length === 0) { return true; }
    }
    if( typeof (value) === 'object') {
        if(Object.keys(value).length === 0) { return true; }
    }
    return false;
}

export function isRequired(value) {
    if(!isEmpty(value)) {
        return true;
    }
    return false;
}
export function isNumber(num) {
    if (!isEmpty(num)) {
        const pattern = /^[0-9]+$/g;
        return pattern.test(num.toString());
    }
    return false;
}
export function isDecimal(num) {
    if (!isEmpty(num)) {
        const pattern = /^([0-9],|[0-9].\1|[0-9])+$/i;
        return pattern.test(num.toString())
    }
    return false;
}
export function isFormatPhone(text) {
    if (!isEmpty(text)) {
        const pattern = /^(\+{1}|\(|\)|[0-9]|\-|\s)+$/gim;
        return (text.toString().replace(pattern, "") === "");
    }
    return false;
}
export function isLetter(value) {
    const pattern = /^[a-zA-Z]*$/g;
    return pattern.test(value);
}
export function isCharAt(value, letter) {
    return value === letter;
}
export function isContainsCharAt(value, letter) {
    return value.toUpperCase() === letter.toUpperCase();
}
export function isContainsMail(text) {
    const pattern = /[-+\w.]{1,64}|\@|(?:[A-Z0-9-]{1,63}\.){1,125}|[A-Z]{2,63}$/gi;
    return (text.toString().replace(pattern, "") === "");
}
export function isMail(text) {
    const pattern = /^[-+\w.]{1,64}@(?:[A-Z0-9-]{1,63}\.){1,125}[A-Z]{2,63}$/i;
    return pattern.test(text);
}
export function isAlphaNumeric(text) {
    const pattern = /[^A-zñáéíóú ÑÁÉÍÓÚ0-9,\,\.\[\]\\\_\^]/g;
    return (text.toString() === text.toString().replace(pattern, ""));
}
export function isDNI(text) {
    const pattern = /^[0-9]{8,8}$/;
    return pattern.test(text);
}
export function isDescription(text) {
    const pattern = /[^'A-zñáéíóú ÑÁÉÍÓÚ0-9.,;-°$%#\-\,\-\.]|\|/g;
    return (text.toString() === text.toString().replace(pattern, ""));
}
export function minLength(value, size) {
    if(value.length < size) {
        return false;
    }
    return true;
}
export function maxLength(value, size) {
    if(value.length > size) { 
        return false;
    }
    return true;
}
export function isWebAddress(text) {
    const pattern = /[^'A-zñáéíóú ÑÁÉÍÓÚ|-|0-9|,|@|.|:|/|?|=|-]|\\|\'|\^|\|/g;
    return (text.toString() === text.toString().replace(pattern, "")); 
}
export function isWeek(value) {
    return ['LUNES','MARTES','MIERCOLES','JUEVES','VIERNES','SABADO','DOMINGO'].includes(value);
}
export function containsValue(marqs,value) {
    return marqs.includes(value);
}
export function similarValue(marqs = '',value) {
    return marqs.map( m => m.toUpperCase() ).includes(value.toUpperCase());
}
export function isValidRuc(ruc) {
    let strRuc = ruc.toString();
    if (strRuc.length != 11) return false;

    let arrVals = ["10", "15", "16", "17", "20"];
    let initStr = strRuc.substring(0, 2);
    if (arrVals.indexOf(initStr) == -1) return false;

    let charsRUC = strRuc.split('').reverse();
    let minFactor = 2, mulFactor = 7, currentFactor = 2, sum = 0;
    for (let i = 1; i < 11; i++) {
        sum += charsRUC[i] * currentFactor;
        if (currentFactor == mulFactor){
            currentFactor = minFactor;
        }else{
            currentFactor++;
        }
    }
    let checkDigit = 11 - (sum % 11);
    switch (checkDigit) {
        case 10:
            checkDigit = 0;
            break;
        case 11:
            checkDigit = 1;
            break;
    }
    return charsRUC[0] == checkDigit;
}

export const validateExcelFields = (rules = [],value,field = '') => {
    try {
        const elementRules = rules || [];
        let mandatory = true;
        let arrErrors = [];
        if(!elementRules.includes('required') && isEmpty(value)) { mandatory = false; }

        elementRules.map( item => {
            if(mandatory) {
                if(item === 'required') {
                    if(!isRequired(value)) {
                        arrErrors = [(`El campo ${field} es requerido`)]; mandatory = false;
                    };
                } else if (item.includes('format')) {
                    const [,format] = item.split('format:');
                    if(format === 'text') {
                        !isLetter(value) && arrErrors.push(`El campo ${field} no permite números ni caracteres especiales`);
                    } else if (format === 'email') {
                        !isMail(value) && arrErrors.push(`El campo ${field} sólo se permite valores tipo correo`);
                    } else if (format === 'dni') {
                        !isDNI(value) && arrErrors.push(`El campo ${field} no es un formato tipo DNI`);
                    } else if (format === 'number') {
                        !isNumber(value) && arrErrors.push(`El campo ${field} no es númerico`);
                    }  else if (format === 'numeric') {
                        !isNumber(value) && arrErrors.push(`El campo ${field} no es númerico`);
                    } else if (format === 'decimal') {
                        !isDecimal(value) && arrErrors.push(`El campo ${field} no es decimal`);
                    } else if (format === 'alphanumeric') {
                        !isAlphaNumeric(value) && arrErrors.push(`El campo ${field} sólo permite letras y números`);
                    } else if (format === 'description') {
                        !isDescription(value) && arrErrors.push(`El campo ${field} contiene valores no permitidos`);
                    } else if (format === 'webAddress') {
                        !isWebAddress(value) && arrErrors.push(`El campo ${field} no es direción web`);
                    } else if (format === 'week') {
                        !isWeek(value) && arrErrors.push(`El campo ${field} no es día de la semana`);
                    } else if (format.includes('char')) {
                        const letter = format.replace(/char\(|\)/g,'');
                        !isContainsCharAt(value,letter) && arrErrors.push(`El campo ${field} debe contener el valor ${letter}`);
                    } else if (format.includes('similar')) {
                        const form = format.replace(/similar\(|\)/g,'');
                        !similarValue(form.split('/'),value) && arrErrors.push(`El campo ${field} no es un formato ${form}`);
                    } else if (format.includes('equalsChar')) {
                        const letter = format.replace(/equalsChar\(|\)/g,'');
                        !isCharAt(value,letter) && arrErrors.push(`El campo ${field} debe contener el valor ${letter}`);
                    } else if (format === 'DD/MM/YYYY') {
                        if(!isDecimal(value)) {
                            !isDateFormat(format,value) && arrErrors.push(`El campo ${field}, sólo se permite valores tipo fecha formato DD/MM/YYYY`);
                        }
                    } else if (format === 'DD/MM/YYYY hh:mm:ss') {
                        if(!isDecimal(value)) {
                            !isDateFormat(format,value) && arrErrors.push(`El campo ${field}, sólo se permite valores tipo fecha formato DD/MM/YYYY hh:mm:ss`);
                        }
                    } else if (format === 'hh:mm') {
                        if(!isDecimal(value)) {
                            !isTimeFormat(format,value) && arrErrors.push(`El campo ${field} no es un formato HH24:MM`);
                        }
                    } else if ((/^\[.*.\]$/g).test(format)) {
                        const marqs = format.replace(/^\[|\]$/g,'').split('/');
                        !containsValue(marqs,value) && arrErrors.push(`El campo ${field} no es un formato ${format}`);
                    }
                } else if (item.includes('max')) {
                    const size = item.split(':')[1];
                    !maxLength(value, parseInt(size)) && arrErrors.push(`Este campo ${field} debe tener máximo ${size} caracteres`);
                } else if (item.includes('min')) {
                    const size = item.split(':')[1];
                    !minLength(value, parseInt(size)) && arrErrors.push(`Este campo ${field} debe tener mímino ${size} caracteres`);
                }
            }
        });
        return arrErrors;
    } catch (e) {
        return ['Error en el registro'];
    }
}

export const validateForms = (rules,element,value) => {
    const elementRules = rules[element];
    let arrErrors = [];
    elementRules.map((item)=>{
        if (item === 'required' ) {
            !isRequired(value) && arrErrors.push('Debe llenar este campo');
        } else if(item === 'email') {
            !isMail(value) && arrErrors.push('El correo ingresado es incorrecto');
        } else if (item.includes('format')) {
            const [,format] = item.split('format:');
            if (format === 'alphanumeric') {
                !isAlphaNumeric(value) && arrErrors.push(`Sólo se permite letras y números`);
            } 
        } else if(item.split(':')[0]==='max') {
            const size = parseInt(item.split(':')[1]);
            !maxLength(value,size) && arrErrors.push("Este campo debe tener máximo " + size + " caracteres");
        } else if(item.split(':')[0]==='min') {
            const size = parseInt(item.split(':')[1]);
            !minLength(value,size) && arrErrors.push("Este campo debe tener mínimo " + size + " caracteres");
        }
    })
    return {field: element,errors: arrErrors};
}