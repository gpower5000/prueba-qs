import {
    ACTION_AUTH_SET_SIGNGIN,
    ACTION_AUTH_SET_SIGNOUT,
    ACTION_USER_RESTART_DATA,
    ACTION_USER_STORE_DATA,
    ACTION_USER_DELETE_DATA
} from '../../toolbox/constants/action-type';

const initialState = {
    apemat    : "",
    apepat    : "",
    dni       : "",
    nombre    : "",
    timeStamp : null
};
let ROL_ID;

export default function ( state = initialState, action) {
	switch(action.type){
		case ACTION_AUTH_SET_SIGNGIN:
			return {
                ...state,
                isAuthenticate: true
            }
		case ACTION_AUTH_SET_SIGNOUT:
			return {
                ...state,
                isAuthenticate: false
            }
		case ACTION_USER_STORE_DATA:
            if (action.payload.user) {
                if (action.payload.user) {
                    if (action.payload.user.userModules) {
                        action.payload.user.userModules.forEach( item => {
                            ROL_ID = item.ROL_ID
                        });
                        action.payload.user.userData.ROL_ID = ROL_ID;
                    }
                }
            }
			return {
                ...state,
                ...action.payload.user
            }
        case ACTION_USER_RESTART_DATA:
            return {
                ...state,
                ...INITIAL_STATE
            }
        case ACTION_USER_DELETE_DATA:
            return {}
		default:
			return state
	}
}