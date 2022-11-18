import { API_BASE_URL } from '../../toolbox/config';
import axios from 'axios';
import { getDateTimeText } from '../../toolbox/helpers/date.helper';
import * as download from 'downloadjs';

export async function apiGetAllRoles(params) {
    try {
        const { data } = await axios.get(`${API_BASE_URL}/role`);
        return data.Resp.data;
    } catch (e) {
        throw e;
    }
}