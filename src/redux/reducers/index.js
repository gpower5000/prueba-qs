import { combineReducers } from 'redux';

import application from './application.reducer';
import auth from './auth.reducer';

export default combineReducers({
    application,
    auth
});