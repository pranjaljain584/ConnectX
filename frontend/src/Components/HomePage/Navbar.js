import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import {Button} from 'reactstrap';
import IconButton from '@material-ui/core/IconButton';
import { Link } from 'react-router-dom';
// import MenuIcon from '@material-ui/icons/Menu';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    height:'6rem' ,
  },
  menuButton: {
    marginLeft : theme.spacing(5) ,
    marginRight: theme.spacing(3),
  },
  title: {
    flexGrow: 1,
  },
  button:{
    backgroundColor:'white',
    width:'5rem'
  }
}));

export default function ButtonAppBar() {
  const classes = useStyles();

  const handleClick = () => {
    
  }

  return (
    <div className={classes.root}>
      <AppBar position='static' style={{ backgroundColor: '#385A64' }}>
        <Toolbar>
          <IconButton
            edge='start'
            className={classes.menuButton}
            color='inherit'
            aria-label='menu'
          >
            icon
          </IconButton>
          <Typography variant='h5' className={classes.title}>
            Microsoft Teams
          </Typography>
          <Link to='/login'>
            <Button className={classes.button} outline color='white'>
              Login
            </Button>
          </Link>
        </Toolbar>
      </AppBar>
    </div>
  );
}
