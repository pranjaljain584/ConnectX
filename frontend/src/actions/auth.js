import axios from 'axios';
import setAuthToken from '../utils/setAuthToken';
import {
  AUTH_ERROR,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  REGISTER_FAIL,
  REGISTER_SUCCESS,
  USER_LOADED,
  LOGOUT,
} from './actionTypes';

// Load user
export const loadUser = () => {
  return async (dispatch) => {
    if (localStorage.token) {
      setAuthToken(localStorage.token);
    }

    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/auth`);

      dispatch({
        type: USER_LOADED,
        payload: res.data,
      });
    } catch (err) {
      dispatch({
        type: AUTH_ERROR,
      });
    }
  };
};

// add alert for each error later
// Register User
export const register = ({ name, email, password}) => {
  return async (dispatch) => {
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const body = JSON.stringify({
      name,
      email,
      password,
    });

    try {
      const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/users`, body, config);

      dispatch({
        type: REGISTER_SUCCESS,
        payload: res.data,
      });

      dispatch(loadUser());
    } catch (err) {
      // const errors = err.response.data.errors;
      // if(errors){
      // dispatch alert for each error
      // }
      dispatch({
        type: REGISTER_FAIL,
      });
    }
  };
};

// google auth
export const googleAuth = ({ name, email }) => {
  return async (dispatch) => {
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const body = JSON.stringify({
      name,
      email,
    });

    try {
      
      dispatch(loadUser());
    } catch (err) {
      dispatch({
        type: REGISTER_FAIL,
      });
    }
  };
};

// Login User
export const login = (email, password) => {
  return async (dispatch) => {
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const body = JSON.stringify({ email, password });

    try {
      const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/auth`, body, config);

      dispatch({
        type: LOGIN_SUCCESS,
        payload: res.data,
      });

      dispatch(loadUser());
    } catch (err) {
      // const errors = err.response.data.errors;
      // if(errors){
      // dispatch alert for each error
      // }
      dispatch({
        type: LOGIN_FAIL,
      });
    }
  };
};

export const logout = () => (dispatch) => {
  setAuthToken(null);
  dispatch({ type: LOGOUT });
};
