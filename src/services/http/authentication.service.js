import { API_BASE_URL } from '../../toolbox/config';
import axios from 'axios';
import { isEmpty } from '../../toolbox/helpers/validator.helper';

export const apiLoginUser = async (params) => {
    try {
        const { data } = await axios.post(`${API_BASE_URL}/login`, params);
        return data;
    } catch (e) {
        throw e;
    }
};

export const apiLogoutUser = async (params) => {
    try {
        const { data } = await axios.post(`${API_BASE_URL}/logout`, params);
        return data;
    } catch (e) {
        return null;
    }
};

export const apiVerifyToken = async (params) => {
    try {
        const { data } = await axios.post(`${API_BASE_URL}/verify`, params);
        return data;
    } catch (e) {
        return { data: {} };
    }
};

/* Servicio de WMS*/
export async function apiGetStoreByUser(params) {
    try {
        const { data } = await axios.get(`${API_BASE_URL}/user/store`, {
            params: params
        });
        return data.Resp.data;
    } catch (e) {
        throw e;
    }
}

export async function apiLoginWMS(wms, userId) {
    try {
        const { data } = await axios.get(`${wms.apis}/wms/lgfapi/v10/entity/user/?univ_id_1=${userId}`, {
          transformRequest: (_, headers) => {
            delete headers.common['APP_KEY'];
          },
          auth: {
            username: wms.user,
            password: wms.pass
          }
        });
        return data;
    } catch (e) {
        throw e;
    }
}

export async function apiSaveCredentialsWMS(rpta_wms, userId) {
    try {
        if (!isEmpty(rpta_wms.results) && rpta_wms.results.length > 0) {
            const result = rpta_wms.results[0];
            const params = {
                usuario: userId,
                user_id: result.id,
                user_url: result.url,
                facily_id:  result.facility_id?.id,
                facility_code: result.facility_id?.key,
                company_id: result.company_id?.id,
                company_code: result.company_id?.key, 
                auth_user_id: result.auth_user_id?.id,
                username: result.auth_user_id?.username,
                wms_is_active: result.auth_user_id?.is_active,
                wms_univ_id_1: result.univ_id_1
            };
            return await axios.post(`${API_BASE_URL}/user/wms`, params);
        }
    } catch (e) {
        console.log('e', e);
        return null;
    }
}