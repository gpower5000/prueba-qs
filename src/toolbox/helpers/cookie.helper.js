import jsCookies from 'js-cookie';
import { Buffer } from 'browser-buffer';

const COOKIE =  new Buffer(process.env.REACT_APP_KEY_COOKIE)
                    .toString('base64').replace(/=/g, '');
const SPLIT_DATA = '|';

const setAuthCookie = (token) =>{
    const json = `${token}${SPLIT_DATA}${Date.now()}`;
    const encodedText = new Buffer(json).toString('base64');
    jsCookies.set(COOKIE, encodedText);
}

const removeAuthCookie = () => {
    jsCookies.remove(COOKIE);
}

const readAuthCookie = () => {
    let cookieValue = jsCookies.get(COOKIE);
    if(cookieValue !== undefined) {
        const decodedText = new Buffer(cookieValue, 'base64').toString('ascii')
        const parts = decodedText.split(SPLIT_DATA)
        const parsedValue = parts.length ? parts[0] : {}
        return parsedValue
    } else {
        return null;
    }
    
}


export {
    setAuthCookie,
    removeAuthCookie,
    readAuthCookie
}