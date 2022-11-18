import axios from 'axios';

axios.defaults.headers.common['APP_KEY'] = 'YXBwX2JsdWVfeW9uZGVyXzIwMjA=$h';

export const API_BASE_URL        = process.env.REACT_APP_BASE_URL+'/api/v1/auditoria';
export const API_GMT             = '-5';
export const API_DATE_FORMAT     = 'DD/MM/YYYY';
export const API_TIME_FORMAT     = 'hh:mm';
export const APP_NAME_PROJECT    = process.env.REACT_APP_PROJECT_NAME;

export const CODE_BAD_REQUEST    = 'SERVER_ERROR';
export const CODE_FAILURE_RESULT = 'RESPONSE_FAILE';
export const CODE_SUCCESS_RESULT = 'RESPONSE_OK';
export const MSG_SUCCESS_RESULT  = 'OK';
export const CODE_DELETE_RESULT  = 'Registro a Eliminar';

export const APP_DESKTOP_WIDTH   = 992;

export const GuideStateView  = {
    maxLimitDays: 7,
    isActiveDate: true,
}