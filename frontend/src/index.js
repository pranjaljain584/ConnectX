import React from 'react';
import ReactDOM from 'react-dom';
// import setAuthToken from './utils/setAuthToken';
import './index.css';
import App from './Components/App';
import reportWebVitals from './reportWebVitals';
import { Provider } from 'react-redux';
import store from './store';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
// import jwt_decode from 'jwt-decode';
import { loadUser } from './actions/auth';

if (localStorage.token) {
  // setAuthToken(localStorage.token);
  const token = localStorage.token;
  if (token) {
    axios.defaults.headers.common['x-auth-token'] = token;
    // const decoded = jwt_decode(token);
    console.log('dispatchhhh') ;
    store.dispatch(loadUser()) ;
  } else {
    delete axios.defaults.headers.common['x-auth-token'];
  }
}

// store.di

ReactDOM.render(
  <Provider store={store}>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </Provider>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
