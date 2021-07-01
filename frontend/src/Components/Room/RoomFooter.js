import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faVideo,
  faMicrophone,
  faDesktop,
  faMicrophoneSlash,
  faVideoSlash,
  faPlus
} from '@fortawesome/free-solid-svg-icons';
import '../../assets/css/pageFooter.css';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import axios from 'axios' ;

const RoomFooter = ({
  isPresenting,
  stopScreenShare,
  screenShare,
  isAudio,
  toggleAudio,
  isVideo,
  toggleVideo,
  disconnectCall,
  url,
  userName,
  userEmail
}) => {
  const [clicked,setClicked] = useState(false) ; 
  const [mail,setEmail] = useState('') ;
  const handleClose = () => {
    setClicked(false) ;
  };
  const handleChange = (e) => {
    setEmail(e.target.value) ;
    // setRoomTitle(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault() ;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        'x-auth-token': localStorage.token,
      },
    };

    const body = {
      sendTo:mail,
      userEmail,
      userName,
      inviteLink: `${url}`,
    };

    axios
      .post(`http://localhost:5000/api/mail/meet`, body, config)
      .then((response) => {
        // console.log(response) ;
      })
      .catch((err) => console.log(err));
    setClicked(false) ;
    setEmail('') ;
  }
  return (
    <div className='footer-item'>
      <div className='center-item'>
        {clicked ? (
          <Dialog
            open={clicked}
            fullWidth
            aria-labelledby='form-dialog-title'
          >
            <DialogTitle id='form-dialog-title'>Invite others</DialogTitle>
            <DialogContent>
              <DialogContentText>
                Enter Email id
              </DialogContentText>
              <TextField
                autoFocus
                margin='dense'
                id='roomTitle'
                label='Email id'
                type='email'
                fullWidth
                onChange={handleChange}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose} color='primary'>
                Cancel
              </Button>
              <Button onClick={handleSubmit} color='primary'>
                Done
              </Button>
            </DialogActions>
          </Dialog>
        ) : null}
        <div className='icon-block' onClick={() => setClicked(!clicked)}>
          <FontAwesomeIcon
            className='icon'
            style={{ color: '#10B664' }}
            icon={faPlus}
          />
  
        </div>
        <div
          className={`icon-block ${!isAudio ? 'red-bg' : null}`}
          onClick={() => toggleAudio(!isAudio)}
        >
          <FontAwesomeIcon
            className='icon'
            icon={isAudio ? faMicrophone : faMicrophoneSlash}
          />
        </div>
        <div onClick={disconnectCall}>
          <div className='end-call'>End Call</div>
        </div>
        <div
          className={`icon-block ${!isVideo ? 'red-bg' : null}`}
          onClick={() => toggleVideo(!isVideo)}
        >
          <FontAwesomeIcon
            className='icon'
            icon={isVideo ? faVideo : faVideoSlash}
          />
        </div>
        {isPresenting ? (
          <div className='icon-block' onClick={stopScreenShare}>
            <FontAwesomeIcon className='icon blue' icon={faDesktop} />
          </div>
        ) : (
          <div className='icon-block' onClick={screenShare}>
            <FontAwesomeIcon className='icon' icon={faDesktop} />
          </div>
        )}
      </div>
    </div>
  );
};

export default RoomFooter;
