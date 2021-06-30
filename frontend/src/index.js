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

// import React from 'react';
// import ReactDOM from 'react-dom';
// import { createBrowserHistory } from 'history';
// import { Router, Route, Switch, Redirect } from 'react-router-dom';
// import { Provider } from 'react-redux';
// import store from './store';
// import AdminLayout from 'layouts/Admin/Admin.js';
// import RTLLayout from 'layouts/RTL/RTL.js';
// import jwt_decode from 'jwt-decode';
// import setAuthToken from './utils/setAuthToken';
// import { setCurrentUser, logoutUser } from './actions/authActions';
// import Login from '../src/views/Login';
// import SignUp from '../src/views/signUp';
// import PrivateRoute from './components/private-route/PrivateRoute';

// import 'assets/scss/black-dashboard-react.scss';
// // import 'react-big-calendar/lib/css/react-big-calendar.css'
// import '../node_modules/react-big-calendar/lib/sass/styles.scss';
// import 'assets/demo/demo.css';
// import 'assets/css/nucleo-icons.css';
// import ForgotPassword from 'views/ForgotPassword';

// const hist = createBrowserHistory();

// // Check for token to keep user logged in
// if (localStorage.jwtToken) {
//   // Set auth token header auth
//   const token = localStorage.jwtToken;
//   setAuthToken(token);
//   // Decode token and get user info and exp
//   const decoded = jwt_decode(token);
//   // Set user and isAuthenticated
//   store.dispatch(setCurrentUser(decoded));
//   // Check for expired token
//   const currentTime = Date.now() / 1000; // to get in milliseconds
//   if (decoded.exp < currentTime) {
//     // Logout user
//     store.dispatch(logoutUser());
//     // Redirect to login
//     window.location.href = './login';
//   }
// }

// ReactDOM.render(
//   <Provider store={store}>
//     <Router history={hist}>
//       <Switch>
//         <Route exact path='/login' render={(props) => <Login {...props} />} />
//         <Route
//           exact
//           path='/sign-up'
//           render={(props) => <SignUp {...props} />}
//         />
//         <Route
//           exact
//           path='/forgot-password'
//           render={(props) => <ForgotPassword {...props} />}
//         />
//         <PrivateRoute
//           path='/admin'
//           component={(props) => <AdminLayout {...props} />}
//         />
//         <Redirect from='/' to='/admin/new-entry' />
//       </Switch>
//     </Router>
//   </Provider>,
//   document.getElementById('root')
// );
