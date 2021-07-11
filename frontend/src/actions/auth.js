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
import { toast } from 'react-toastify';

const settings = {
  position: 'top-right',
  autoClose: 2000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
};

// Load user
export const loadUser = () => {
  return async (dispatch) => {
    if (localStorage.token) {
      setAuthToken(localStorage.token);
    }

    try {
      // get user data
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
export const register = ({ name, email, password }) => {
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
      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/users`,
        body,
        config
      );

      dispatch({
        type: REGISTER_SUCCESS,
        payload: res.data,
      });
      
      toast.success('Registered Successfully !', settings);
      dispatch(loadUser());
    } catch (err) {
      if(err.response.status === 400){
        console.log('here');
        toast.error('User already exists !', settings);
      }else{
        toast.error('Unable to Register !', settings);
      }
      dispatch({
        type: REGISTER_FAIL,
      });
    }
  };
};

// google auth
export const googleAuth = ({ name, email }) => {
  return async (dispatch) => {
    try {
      toast.success('Authenticated Successfully!', settings);

      dispatch(loadUser());
    } catch (err) {
      dispatch({
        type: REGISTER_FAIL,
      });

      toast.error('Unable to Authenticate !', settings);
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
      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/auth`,
        body,
        config
      );

      toast.success('Logged In Successfully !', settings);

      console.log(res.data) ;
      dispatch({
        type: LOGIN_SUCCESS,
        payload: res.data,
      });

      dispatch(loadUser());
    } catch (err) {
      dispatch({
        type: LOGIN_FAIL,
      });
      toast.error('Invalid Credentials !', settings);
    }
  };
};

export const logout = () => (dispatch) => {
  setAuthToken(null);
  dispatch({ type: LOGOUT });
  toast.success('Logged Out Successfully !', settings);
};
