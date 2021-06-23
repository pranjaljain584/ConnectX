import React, { useEffect, useState } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
} from 'react-router-dom';
import Home from './HomePage/Home.js';
import setAuthToken from '../utils/setAuthToken';
import { loadUser } from '../actions/auth';
import { connect } from 'react-redux';
import '../assets/css/App.css';
import Login from './Auth/Login.js';
import Register from './Auth/Register.js';
import Page404 from './Page404.js';
import Dashboard from './Dashboard/Dashboard.js';
import Room from './Room/Room.js';
import Loading from './Room/Loading.js';
import ChatRoomJoining from './Channel/ChatRoomJoining.js';
import ErrorPage from './ErrorPage.js';

if (localStorage.token) {
  setAuthToken(localStorage.token);
}

const PrivateRoute = (privateRouteProps) => {
  console.log('privateRouteProps', privateRouteProps);
  const { isAuthenticated, component: Component, path } = privateRouteProps;

  const [isLoggedIn, setLogIn] = useState(false);

  return (
    <Route
      path={path}
      render={(props) => {
        return isAuthenticated ? (
          <Component {...props} />
        ) : (
          <Redirect
            to={{
              pathname: '/login',
              state: {
                from: props.location,
              },
            }}
          />
        );
      }}
    />
  );
};

function App(props) {
  useEffect(() => {
    //console.log(props.auth.isAuthenticated);
    props.dispatch(loadUser());
  }, []);

  const { isAuthenticated } = props.auth;
  // console.log(isAuthenticated);

  return (
    <Router>
      <div>
        {/* {isAuthenticated ? <TopBarAndDrawer /> : <Navigationbar />} */}
        <Switch>
          <Route exact path='/' component={Home} />
          <Route path='/login' component={Login} />
          <Route path='/register' component={Register} />
          {props.auth.isAuthenticated === null ? null : (
            <PrivateRoute
              path='/dashboard'
              component={Dashboard}
              isAuthenticated={props.auth.isAuthenticated}
            />
          )}
          {props.auth.isAuthenticated === null ? null : (
            <PrivateRoute
              path='/invite/:chatRoomId'
              component={ChatRoomJoining}
              isAuthenticated={props.auth.isAuthenticated}
            />
          )}
          <Route path='/loading' component={Loading} />
          <Route path='/room/:roomId' component={Room} />
          <Route path="/error" component={ErrorPage} />
          <Route component={Page404} />
        </Switch>
      </div>
    </Router>
  );
}

function mapStateToProps(state) {
  return {
    auth: state.auth,
  };
}

export default connect(mapStateToProps)(App);
