export function padString(num,digits = 1,pad = 0){
    let str    = (""+num);
    let length = Math.max(digits-str.length,0);
    return (Array(length+1).join(pad) + str);
}
export function valToString(val) {
    if (val === null || val === undefined) {
        return '"##"'
    } else if (val.constructor === Number) {
        return val
    } else if (val.constructor === Boolean) {
        return val
    } else {
        if ((/\\"/gi).test(val)) {
            return '"'+val.replace(/\\"/gi,'\\\\"')+'"'
        } else {
            return '"'+val.replace(/"/gi,'')+'"'
        }
    }
}
export const camelCase = (str) => {
    return str
        .replace(/\s(.)/g, ($1) => $1.toUpperCase())
        .replace(/\s/g, '')
        .replace(/^(.)/,   ($1) => $1.toLowerCase()) 
}