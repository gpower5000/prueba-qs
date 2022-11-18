import {
	ACTION_SET_APPLICATION_LOADING,
	ACTION_SET_APPLICATION_MESSAGES,
	ACTION_SET_MENU
} from '../../toolbox/constants/action-type';

const initialState = {
	applicationLoading: false,
	actionMessageStatus: null,
	actionMessageType: null,
	status: null,
	project_name: process.env.REACT_APP_PROJECT_NAME,
	name: process.env.REACT_APP_PROJECT_NAME,
	format_name: 'Química Suiza',
	format_owner: 'QS '+(new Date).getFullYear(),
	menu: []
}

export default function (state=initialState, action){
	switch(action.type){
		case ACTION_SET_APPLICATION_LOADING:
			return Object.assign({},state,{applicationLoading : action.payload})
		case ACTION_SET_MENU: 
			return Object.assign({}, state, { menu: action.payload })
		case ACTION_SET_APPLICATION_MESSAGES:
			return Object.assign({},state,{actionMessageStatus : action.payload.message,actionMessageType:action.payload.type,status:action.payload.status})
		default:
			return state
	}
}