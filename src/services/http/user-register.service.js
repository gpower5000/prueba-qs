import { API_BASE_URL } from '../../toolbox/config';
import axios from 'axios';
import { getDateTimeText } from '../../toolbox/helpers/date.helper';
import * as download from 'downloadjs';

export async function apiGetAllTypeUser(params) {
    try {
        const { data } = await axios.get(`${API_BASE_URL}/user/type-user`);
        return data.Resp.data;
    } catch (e) {
        throw e;
    }
}

export async function apiGetAllStateUser(params) {
    try {
        const { data } = await axios.get(`${API_BASE_URL}/user/state`);
        return data.Resp.data;
    } catch (e) {
        throw e;
    }
}

export async function apiGetUserById(params) {
    try {
        const { data } = await axios.get(`${API_BASE_URL}/user/id`, {
            params: params
        });
        return data.Resp.data;
    } catch (e) {
        throw e;
    }
}

export async function apiSaveUser(id, params) {
    try {
        const { data } = await axios.post(`${API_BASE_URL}/user`, params);
        return data;
    } catch (e) {
        throw e;
    }
}

export async function apiUpdateUser(id, params) {
    try {
        const { data } = await axios.patch(`${API_BASE_URL}/user/` + id, params);
        return data;
    } catch (e) {
        throw e;
    }
}

export async function apiDeleteUser(params) {
    try {
        const { data } = await axios.delete(`${API_BASE_URL}/user/` + params.id, params);
        return data.Resp.data;
    } catch (e) {
        throw e;
    }
}

export async function downloadExcelFile(params) {
    return axios({
        url: `${API_BASE_URL}/user/excel`,
        method: 'get',
        headers: {
            'Content-Type': 'application/json',
            withCredentials: true,
        },
        responseType: 'arraybuffer'
    }).then(async response => {
        download(
            response.data,
            'SateliteQS-USER_' + getDateTimeText() + '.xlsx',
            'application/vnd.ms-excel'
        )
        return true;
    }).catch((err) => {
        return false;
    });
}

export async function apiGetAllStore(params) {
    try {
        const { data } = await axios.get(`${API_BASE_URL}/store`, {
            params: params
        });
        return data.Resp.data;
    } catch (e) {
        throw e;
    }
}
/* Locales por usuario WMS*/
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

/* Save Locale por usuario */

export async function apiSaveUserStore(params) {
    try {
        const { data } = await axios.post(`${API_BASE_URL}/user/store`, params);
        return data;
    } catch (e) {
        throw e;
    }
}