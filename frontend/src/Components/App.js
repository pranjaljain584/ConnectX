import React, { useEffect, useState } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
} from 'react-router-dom';
import Home from './Home';
import setAuthToken from '../utils/setAuthToken';
import { loadUser } from '../actions/auth';
import { connect } from 'react-redux';
import '../css/App.css';

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
          <Redirect to='/login' />
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
  console.log(isAuthenticated);

  return (
    <Router>
      <div>
        {/* {isAuthenticated ? <TopBarAndDrawer /> : <Navigationbar />} */}
        <Switch>
          <Route exact path='/' component={Home} />
          {/* <Route path='/login' component={Login} />
          <Route path='/register' component={Register} /> */}

          
          {/* <Route component={Page404} /> */}
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
