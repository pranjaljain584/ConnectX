import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faVideo,
  faMicrophone,
  faDesktop,
  faMicrophoneSlash,
  faVideoSlash,
  faPlus,
  faChalkboardTeacher,
  faInfo,
  faCopy,
} from '@fortawesome/free-solid-svg-icons';
import '../../assets/css/pageFooter.css';
import { Link } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import axios from 'axios';
import ReactTooltip from 'react-tooltip'

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
  userEmail,
  handleSubmit,
  roomId,
}) => {
  const [clicked, setClicked] = useState(false);
  const [info, setInfo] = useState(false);
  const [mail, setEmail] = useState('');
  const [whiteboard, setWhiteboard] = useState(false);
  const handleClose = () => {
    setClicked(false);
    setInfo(false);
  };
  const handleChange = (e) => {
    setEmail(e.target.value);
  };

  const handleSubmit2 = (e) => {
    e.preventDefault();
    const config = {
      headers: {
        'Content-Type': 'application/json',
        'x-auth-token': localStorage.token,
      },
    };

    const body = {
      sendTo: mail,
      userEmail,
      userName,
      inviteLink: `${url}`,
    };

    // send invite mail
    axios
      .post(`${process.env.REACT_APP_API_URL}/api/mail/meet`, body, config)
      .then((response) => {
      })
      .catch((err) => console.log(err));
    setClicked(false);
    setEmail('');
  };
  return (
    <div className='footer-item'>
      <div className='center-item'>
        {clicked ? (
          <Dialog open={clicked} fullWidth aria-labelledby='form-dialog-title'>
            <DialogTitle id='form-dialog-title'>Invite others</DialogTitle>
            <DialogContent>
              <DialogContentText>Enter Email id</DialogContentText>
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
              <Button onClick={handleSubmit2} color='primary'>
                Done
              </Button>
            </DialogActions>
          </Dialog>
        ) : null}
        <div
          data-tip='Info'
          className='icon-block'
          onClick={(e) => {
            setInfo(true);
          }}
        >
          <FontAwesomeIcon
            className='icon'
            style={{ color: '#339AF0' }}
            icon={faInfo}
          />
        </div>
        {info ? (
          <Dialog open={info} fullWidth aria-labelledby='form-dialog-title'>
            <DialogTitle id='form-dialog-title'>Meeting Link</DialogTitle>
            <DialogContent>
              <div className='meet-link'>
                <span>{url}</span>
                &nbsp;
                <FontAwesomeIcon
                  className='icon'
                  icon={faCopy}
                  onClick={() => navigator.clipboard.writeText(url)}
                />
              </div>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose} color='primary'>
                Cancel
              </Button>
            </DialogActions>
          </Dialog>
        ) : null}
        <div
          data-tip='Invite Others'
          className='icon-block'
          onClick={() => setClicked(!clicked)}
        >
          <FontAwesomeIcon
            className='icon'
            style={{ color: '#10B664' }}
            icon={faPlus}
          />
        </div>
        <div
          data-tip='Toggle Audio'
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
          data-tip='Toggle Video'
          className={`icon-block ${!isVideo ? 'red-bg' : null}`}
          onClick={() => toggleVideo(!isVideo)}
        >
          <FontAwesomeIcon
            className='icon'
            icon={isVideo ? faVideo : faVideoSlash}
          />
        </div>
        {isPresenting ? (
          <div
            className='icon-block'
            onClick={stopScreenShare}
            data-tip='Stop ScreenShare'
          >
            <FontAwesomeIcon className='icon blue' icon={faDesktop} />
          </div>
        ) : (
          <div
            className='icon-block'
            onClick={screenShare}
            data-tip='Start Screenshare'
          >
            <FontAwesomeIcon className='icon' icon={faDesktop} />
          </div>
        )}
        <Link
          onClick={(e) => {
            setWhiteboard(!whiteboard);
            handleSubmit(e, true);
          }}
          to={`/board/${roomId}`}
          target='_blank'
        >
          <div className={`icon-block`} data-tip='Join WhiteBoard'>
            <FontAwesomeIcon
              className={`icon`}
              icon={faChalkboardTeacher}
            />
          </div>
        </Link>
      </div>
      <ReactTooltip />
    </div>
  );
};

export default RoomFooter;
