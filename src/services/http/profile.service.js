import { API_BASE_URL } from '../../toolbox/config';
import * as download from 'downloadjs';
import { getDateTimeText } from '../../toolbox/helpers/date.helper';
import axios from 'axios';

/**
 * @CRUD rol
 * @description Procesos para el CRUD de los Perfiles
 */

export async function apiGetAllProfile(params) {
    try {
        const { data } = await axios.get(`${API_BASE_URL}/profile-maintenance`, {
            params: params
        });
        return data.Resp.data;
    } catch (e) {
        throw e;
    }
}

export async function apiGetProfileById(params) {
    try {
        const { data } = await axios.get(`${API_BASE_URL}/profile-maintenance/id`, {
            params: params
        });
        return data.Resp.data;
    } catch (e) {
        throw e;
    }
}

export async function apiSaveProfile(params) {
    try {
        const { data } = await axios.post(`${API_BASE_URL}/profile-maintenance`, params);
        return data;
    } catch (e) {
        throw e;
    }
}

export async function apiUpdateProfile(id, params) {
    try {
        const { data } = await axios.patch(`${API_BASE_URL}/profile-maintenance/` + id, params);
        return data;
    } catch (e) {
        throw e;
    }
}

export async function apiDeleteProfile(params) {
    try {
        const { data } = await axios.delete(`${API_BASE_URL}/profile-maintenance/` + params.id);
        return data;
    } catch (e) {
        console.log('>>> e',e );
        throw e;
    }
}

export async function downloadExcelFile(params) {
    return axios({
        url: `${API_BASE_URL}/profile-maintenance/excel`,
        method: 'get',
        headers: {
            'Content-Type': 'application/json',
            withCredentials: true,
        },
        params: params,
        responseType: 'arraybuffer'
    }).then(async response => {
        download(
            response.data,
            'SateliteQS-profile_' + getDateTimeText() + '.xlsx',
            'application/vnd.ms-excel'
        )
        return true;
    }).catch((err) => {
        console.log('>> err', err);
        return false;
    });
}

/**
 * @CRUD vista_x_rol
 * @description Procesos para el Administrador de Perfiles, Gestion de Pantallas
 */

 export const apiGetModules = async (params) => {
    try {
        const { data } = await axios.post(`${API_BASE_URL}/profile-maintenance/views-by-modules`, params);
        return data.Resp.data;
    } catch (e) {
        return [];
    }
};
export const apiGetModulesByProfile = async (params) => {
    try {
        const { data } = await axios.post(`${API_BASE_URL}/profile-maintenance/views-by-rol`, params);
        return data.Resp.data;
    } catch (e) {
        return [];
    }
};
export const apiIUProfile = async (params) => {
    try {
        const { data } = await axios.post(`${API_BASE_URL}/profile-maintenance/iu-rol`, params);
        return data.Resp.data;
    } catch (e) {
        throw e;
    }
};