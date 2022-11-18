import { createStore } from 'redux';
import Reducers from './reducers/index';

//const store = createStore(Reducers,window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()/*applyMiddleware(sagaMiddleware)*/);
const store = createStore(Reducers);

export default store;

// import { createStore, applyMiddleware } from 'redux';
// import thunkMiddleware from 'redux-thunk';
// import { createLogger } from 'redux-logger';
// import rootReducer from './../redux/reducers';

// const loggerMiddleware = createLogger();

// export const store = createStore(
//     rootReducer,
//     applyMiddleware(
//         thunkMiddleware,
//         loggerMiddleware
//     )
// );