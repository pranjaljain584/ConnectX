import {
  faEllipsisV,
  faUserPlus,
  faVideo,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../../assets/css/chatroom.css';
import { withStyles } from '@material-ui/core/styles';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import { makeStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import PersonIcon from '@material-ui/icons/Person';
import { blue } from '@material-ui/core/colors';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ListIcon from '@material-ui/icons/List';
import ListItemText from '@material-ui/core/ListItemText';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import { connect } from 'react-redux';
import ReactTooltip from 'react-tooltip';
import { io } from 'socket.io-client';
import axios from 'axios';

const socket = io.connect(`${process.env.REACT_APP_API_URL}`, {
  transports: ['websocket'],
});

const useStyles = makeStyles({
  avatar: {
    backgroundColor: blue[100],
    color: blue[600],
  },
});

function ChatHeader(props) {
  const { roomName, roomIdSelected, participants, meet } = props;
  const [showInput, setShowInput] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const userId = props.auth.user?._id;
  const userEmail = props.auth.user?.email;
  const userName = props.auth.user?.name;
  const [sendTo, setSendTo] = useState('');
  const [showP, setShowP] = useState(false);
  const classes = useStyles();
  const toastId = React.useRef(null);

  const notify = (msg) =>
    (toastId.current = toast.warn(`${msg}`, {
      position: 'top-right',
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      autoClose: false,
    }));

  const update = (msg, type) =>
    toast.update(toastId.current, {
      position: 'top-right',
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      type: `${type}`,
      render: `${msg}`,
      autoClose: 3000,
    });

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLeaveRoom = () => {
    notify('Leaving Room');
    socket.emit('leave-room', { roomIdSelected, userId });
    update('Room Left', 'success');
    const config = {
      headers: {
        'Content-Type': 'application/json',
        'x-auth-token': localStorage.token,
      },
    };

    if(meet){
      axios
        .get(
          `${process.env.REACT_APP_API_URL}/api/event/${meet._id}`,
          config
        )
        .then((res) => {

        });
    }
  };

  const handleClickP = () => {
    console.log('Clicked');
    setShowP(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const config = {
      headers: {
        'Content-Type': 'application/json',
        'x-auth-token': localStorage.token,
      },
    };

    const body = {
      sendTo,
      userEmail,
      userName,
      roomName,
      inviteLink: `${process.env.REACT_APP_ENV}/invite/${roomIdSelected}`,
    };

    axios
      .post(`${process.env.REACT_APP_API_URL}/api/mail`, body, config)
      .then((response) => {
        update(response.data.msg, response.data.type);
      })
      .catch((err) => console.log(err));

    notify(`Sending Mail`);
    setShowInput(false);
  };

  return (
    <div className='chat-header'>
      <div style={{ width: '500px' }}>{roomName}</div>

      <div
        style={{ marginLeft: showInput ? '5%' : '32%' }}
        className='add-user'
      >
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
        {meet ? (
          <>
            {' '}
            {new Date(meet.StartTime).getTime() < new Date().getTime() ? (
              <Link to={meet.Description} target='_blank'>
                <FontAwesomeIcon
                  style={{ color: '#55868a', marginTop: '10px', fontSize:'1.7rem' }}
                  data-tip='Join Meet'
                  icon={faVideo}
                />
              </Link>
            ) : null}{' '}
          </>
        ) : (
          <FontAwesomeIcon
            onClick={() => {
              setShowInput((prevState) => {
                return !prevState;
              });
            }}
            className='icon'
            data-tip='Add Participant'
            icon={faUserPlus}
          />
        )}
      </div>

      <Dialog
        onClose={() => setShowP(false)}
        aria-labelledby='simple-dialog-title'
        open={showP}
      >
        <DialogTitle id='simple-dialog-title'>Participants List</DialogTitle>
        <List>
          {participants.map((p) => (
            <ListItem button>
              <ListItemAvatar>
                <Avatar className={classes.avatar}>
                  <PersonIcon />
                </Avatar>
              </ListItemAvatar>
              <ListItemText primary={p} />
            </ListItem>
          ))}
        </List>
      </Dialog>

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
          <StyledMenuItem onClick={handleClickP}>
            <ListItemIcon>
              <ListIcon fontSize='small' />
            </ListItemIcon>
            <ListItemText primary='Participants' />
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

export default connect(mapStateToProps)(ChatHeader);
