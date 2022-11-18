import React from 'react';
import { Provider } from 'react-redux';
import ReactDOM from 'react-dom';
import store from './redux/store';
import AllRoutes from './routes/AllRoutes';
import reportWebVitals from './reportWebVitals';

import './toolbox/config/extends.js';
import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';

ReactDOM.render(
    <Provider store = {store}>
        <AllRoutes />
    </Provider>
  ,document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
