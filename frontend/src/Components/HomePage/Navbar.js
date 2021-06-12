import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
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
  btn: {
    marginRight : theme.spacing(5) ,
    backgroundColor: '#FFFFFF',
  },
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
          <Button className={classes.btn} onClick={handleClick} color='black'>Login</Button>
        </Toolbar>
      </AppBar>
    </div>
  );
}
