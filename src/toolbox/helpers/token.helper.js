/**
 * @author Pedro Mendoza Ardiles
 */
const CryptoJS = require("crypto-js");

export function AESEncode(str, key) {
  return CryptoJS.AES.encrypt(JSON.stringify(str), key).toString();
}

export function AESDecode(chiperText, key) {
  try {
    const bytes = CryptoJS.AES.decrypt(chiperText || '', key);
    const originalText = bytes.toString(CryptoJS.enc.Utf8);
    return JSON.parse(originalText);
  } catch (e) {
    console.log('AESDecode e', e);
    return null;
  }
}