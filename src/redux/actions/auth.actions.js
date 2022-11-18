import {
    ACTION_AUTH_SET_SIGNGIN,
    ACTION_AUTH_SET_SIGNOUT,
    ACTION_USER_RESTART_DATA,
    ACTION_USER_STORE_DATA,
    ACTION_USER_DELETE_DATA
} from '../../toolbox/constants/action-type';

export function ActionSetLogin() {
    return {
        type: ACTION_AUTH_SET_SIGNGIN
    }
}

export function ActionSetLogout() {
    return {
        type: ACTION_AUTH_SET_SIGNOUT
    }
}

export function ActionRestartUser() {
    return  {
        type: ACTION_USER_RESTART_DATA
    }
}

export function ActionStoreUser(user) {
    return {
        type: ACTION_USER_STORE_DATA,
        payload: { user: user }
    }
}

export function ActionDeleteUser() {
    return {
        type: ACTION_USER_DELETE_DATA
    }
}