import CryptoJS from "crypto-js";

const KEY_LOCAL_STORAGE = process.env.REACT_APP_KEY_COOKIE;
const KEY_USER_DATA = 'userData';
const KEY_ARRAY_MY_MENU = 'arrayMyMenu';
const KEY_OBJECT_MY_MENU = 'objectMyMenu';
const KEY_OBJECT_STORAGE_USER = 'objectStorageByUser';

export const saveLocalStorage = (str, KEY_SECRET) => {
    const chiperText = CryptoJS.AES.encrypt(
        JSON.stringify(str), KEY_LOCAL_STORAGE
    ).toString();
    localStorage.setItem(KEY_SECRET, chiperText);
}

export const removeLocalStorage = (KEY_SECRET) => {
    localStorage.removeItem(KEY_SECRET);
}

export const readLocalStorage = (KEY_SECRET) => {
    try {
        const chiperText = localStorage.getItem(KEY_SECRET);
        const bytes = CryptoJS.AES.decrypt(chiperText || '', KEY_LOCAL_STORAGE);
        const originalText = bytes.toString(CryptoJS.enc.Utf8);

        return JSON.parse(originalText);
    } catch (e) {
        return null;
    }

}


export const setAuthLocalStorage = (str) => saveLocalStorage(str, KEY_USER_DATA);
export const removeAuthLocalStorage = () => removeLocalStorage(KEY_USER_DATA);
export const readAuthLocalStorage = () => readLocalStorage(KEY_USER_DATA);

export const setArrMenuLocalStorage = (str) => saveLocalStorage(str, KEY_ARRAY_MY_MENU);
export const removeArrMenuLocalStorage = () => removeLocalStorage(KEY_ARRAY_MY_MENU);
export const readArrMenuLocalStorage = () => readLocalStorage(KEY_ARRAY_MY_MENU);

export const setObjMenuLocalStorage = (str) => saveLocalStorage(str, KEY_OBJECT_MY_MENU);
export const removeObjMenuLocalStorage = () => removeLocalStorage(KEY_OBJECT_MY_MENU);
export const readObjMenuLocalStorage = () => readLocalStorage(KEY_OBJECT_MY_MENU);

export const setObjectStorageByUser = (str) => saveLocalStorage(str, KEY_OBJECT_STORAGE_USER);
export const removeObjectStorageByUser = () => removeLocalStorage(KEY_OBJECT_STORAGE_USER);
export const readObjectStorageByUser = () => readLocalStorage(KEY_OBJECT_STORAGE_USER);