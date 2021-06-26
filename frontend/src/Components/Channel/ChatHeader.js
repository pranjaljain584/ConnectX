import { faEllipsisV, faUserPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState } from 'react';
import '../../assets/css/chatroom.css';
import { withStyles } from '@material-ui/core/styles';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import CreateIcon from '@material-ui/icons/Create';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import { connect } from 'react-redux';
import ReactTooltip from 'react-tooltip';
import { io } from 'socket.io-client';
import axios from 'axios';

const socket = io.connect('http://localhost:5000', {
  transports: ['websocket'],
});

function ChatHeader(props) {
  const { roomName , roomIdSelected } = props;
  const [showInput,setShowInput] = useState(false) ;
  const [anchorEl, setAnchorEl] = useState(null);
  const userId = props.auth.user?._id;
  const userEmail = props.auth.user?.email ;
  const userName = props.auth.user?.name ;
  const [sendTo,setSendTo] = useState('') ;

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLeaveRoom = () => {
    socket.emit('leave-room',{roomIdSelected,userId}) ;
  }

  const handleSubmit = (e) => {
    e.preventDefault() ;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        'x-auth-token': localStorage.token,
      },
    };

    const body = {
      sendTo ,
      userEmail,
      userName,
      roomName,
      inviteLink:`http://localhost:3000/invite/${roomIdSelected}`
    }

    axios
      .post(`http://localhost:5000/api/mail`, body, config )
      .then((response) => {
        // console.log(response) ;
      })
      .catch((err) => console.log(err));

      setShowInput(false) ;
  }

  return (
    <div className='chat-header'>
      <div>{roomName}</div>

      <div className='add-user'>
        {showInput && (
          <form onSubmit={handleSubmit}>
            <input
              className='mail-input'
              type='email'
              placeholder='Send invite mail to ...'
              onChange={(e) => {
                setSendTo(e.target.value);
              }}
            />
          </form>
        )}
        <FontAwesomeIcon
          onClick={() => {
            setShowInput(true);
          }}
          data-tip='Add Participant'
          icon={faUserPlus}
        />
      </div>

      <div data-tip='More Options' className='more-optns'>
        <FontAwesomeIcon
          onClick={handleClick}
          className='optn-list'
          icon={faEllipsisV}
        />

        <StyledMenu
          id='customized-menu'
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleClose}
          keepMounted
          open={Boolean(anchorEl)}
          onClose={handleClose}
        >
          <StyledMenuItem onClick={handleLeaveRoom}>
            <ListItemIcon>
              <ExitToAppIcon fontSize='small' />
            </ListItemIcon>
            <ListItemText primary='Leave Room' />
          </StyledMenuItem>
          <StyledMenuItem>
            <ListItemIcon>
              <CreateIcon fontSize='small' />
            </ListItemIcon>
            <ListItemText primary='Update' />
          </StyledMenuItem>
        </StyledMenu>
      </div>
      <ReactTooltip />
    </div>
  );
}

const StyledMenu = withStyles({
  paper: {
    border: '1px solid #d3d4d5',
  },
})((props) => (
  <Menu
    elevation={0}
    getContentAnchorEl={null}
    anchorOrigin={{
      vertical: 'bottom',
      horizontal: 'center',
    }}
    transformOrigin={{
      vertical: 'top',
      horizontal: 'center',
    }}
    {...props}
  />
));

const StyledMenuItem = withStyles((theme) => ({
  root: {
    '&:focus': {
      backgroundColor: '#55868a',
      '& .MuiListItemIcon-root, & .MuiListItemText-primary': {
        color: theme.palette.common.white,
      },
    },
  },
}))(MenuItem);

function mapStateToProps(state) {
  return {
    auth: state.auth,
  };
}

export default connect(mapStateToProps)(ChatHeader) ;
