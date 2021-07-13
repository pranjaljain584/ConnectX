import React, { useState } from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import { Link, Redirect } from 'react-router-dom';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import { connect } from 'react-redux';
import { login } from '../../actions/auth';
import { GoogleLogin } from 'react-google-login';
import GoogleButton from 'react-google-button';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
  
const initialState = {
  email: '',
  password: '',
};

function Login(props) {
  const classes = useStyles();

  const [formData, setFormData] = useState(initialState);

  const notify = (m) =>
    toast.error(`${m}`, {
      position: 'top-right',
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { email, password } = formData;
    await props.dispatch(login(email, password));
  };

  const googleSuccess = async (res) => {
    console.log(res);
    let email = res?.profileObj.email;
    let password = res?.tokenId;

    try {
      await props.dispatch(login(email, password));
    } catch (error) {
      notify('Unable to register !');

      console.log(error);
    }
  };

  const googleFailure = (err) => {
    console.log('Google Sign in Unsuccessful', err);
  };

  const { isAuthenticated } = props.auth;
  const { from } = props.location.state || { from: { pathname: '/dashboard' } };

  // Redirect if logged in

  if (isAuthenticated) {
    return <Redirect to={from} />;
  }

  return (
    <>
      <Link
        to='/'
        style={{ marginLeft: '8px', marginTop: '25px', fontSize: '1.2rem' }}
      >
        <b>Back To Home</b>
      </Link>
      <Container component='main' maxWidth='xs'>
        <CssBaseline />
        <div className={classes.paper}>
          <Avatar className={classes.avatar}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component='h1' variant='h5'>
            Sign in
          </Typography>
          <form onSubmit={handleSubmit} className={classes.form} noValidate>
            <TextField
              variant='outlined'
              margin='normal'
              required
              fullWidth
              id='email'
              label='Email Address'
              name='email'
              autoComplete='email'
              onChange={handleChange}
              autoFocus
            />
            <TextField
              variant='outlined'
              margin='normal'
              required
              fullWidth
              name='password'
              label='Password'
              type='password'
              onChange={handleChange}
              id='password'
              autoComplete='current-password'
            />
            <Button
              type='submit'
              fullWidth
              variant='contained'
              color='primary'
              onSubmit={handleSubmit}
              className={classes.submit}
            >
              Sign In
            </Button>
            <Grid container>
              <Grid item>
                <Link to='/register' variant='body2'>
                  {"Don't have an account? Sign Up"}
                </Link>
              </Grid>
            </Grid>
          </form>
          <p className={classes.para}>or</p>
          <GoogleLogin
            clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}
            render={(renderProps) => (
              <GoogleButton onClick={renderProps.onClick} disabled={false} />
            )}
            onSuccess={googleSuccess}
            onFailure={googleFailure}
            cookiePolicy='single_host_origin'
          />
        </div>
        <Box mt={8}></Box>
      </Container>
    </>
  );
}

function mapStateToProps(state) {
  return {
    auth: state.auth,
  };
}

export default connect(mapStateToProps)(Login);

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  para: {},
}));
