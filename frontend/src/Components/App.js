import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
} from 'react-router-dom';
import PropTypes from 'prop-types';
import Home from './HomePage/Home.js';
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
import Calendar from './Calendar/Calendar.js';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Container from './WhiteBoard/Container.js';

// private route definition
const PrivateRoute = (privateRouteProps) => {
  const { isAuthenticated, component: Component, path } = privateRouteProps;

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

  // routing
  return (
    <Router>
      <div>
        <Switch>
          <Route exact path='/' component={Home} />
          <Route path='/login' component={Login} />
          <Route path='/register' component={Register} />
          <Route path='/calendar' component={Calendar} />
          <PrivateRoute
            path='/dashboard'
            component={Dashboard}
            isAuthenticated={props.auth.isAuthenticated}
          />
          <PrivateRoute
            path='/invite/:chatRoomId'
            component={ChatRoomJoining}
            isAuthenticated={props.auth.isAuthenticated}
          />
          <PrivateRoute
            path='/room/:roomId'
            component={Room}
            isAuthenticated={props.auth.isAuthenticated}
          />
          <PrivateRoute
            path='/board/:roomId'
            component={Container}
            isAuthenticated={props.auth.isAuthenticated}
          />
          <Route path='/loading' component={Loading} />
          <Route path='/error' component={ErrorPage} />
          <Route component={Page404} />
        </Switch>
      </div>
      <ToastContainer
        position='top-right'
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </Router>
  );
}

App.propTypes = {
  auth: PropTypes.object.isRequired,
};

function mapStateToProps(state) {
  return {
    auth: state.auth,
  };
}

export default connect(mapStateToProps)(App);
