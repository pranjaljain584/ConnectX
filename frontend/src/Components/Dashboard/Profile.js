import { Avatar, Badge, Button, makeStyles, Popover } from '@material-ui/core';
import {
  CameraAltOutlined,
} from '@material-ui/icons';
import React from 'react';
import '../../assets/css/profile.css';

const useStyles = makeStyles((theme) => ({
  large: {
    width: theme.spacing(7),
    height: theme.spacing(7),
  },
}));

const Profile = (props) => {
  const classes = useStyles();

  const [anchorEl, setAnchorEl] = React.useState(null);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  return (
    <div className='header'>
      <div className='header__icons'>
        <Avatar className='header__avatar' onClick={handleClick} />
        <Popover
          open={open}
          id={id}
          onClose={handleClose}
          anchorEl={anchorEl}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center',
          }}
          transformOrigin={{
            vertical: 'top',
          }}
        >
          <div className='home__popoverContainer'>
            <div className='home__popover__top'>
              <Badge
                overlap='circle'
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'right',
                }}
                badgeContent={
                  <div className='home__badge'>
                    <CameraAltOutlined className='home__camera' />
                  </div>
                }
              >
                <Avatar className={classes.large} />
              </Badge>
              <div className='home__text'>
                <div className='home__displayName'>
                  {props.name}
                </div>
                <div className='home__mail'>
                  {props.email}
                </div>
              </div>
            </div>
          </div>
        </Popover>
      </div>
    </div>
  );
};

export default Profile;
