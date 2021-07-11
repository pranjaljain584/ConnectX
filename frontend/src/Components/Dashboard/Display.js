import React, { useEffect, useState } from 'react';
import '../../assets/css/display.css';
import { Link } from 'react-router-dom';
import ChatRoom from '../Channel/ChatRoom';
import FileDisplay from '../File/FileDisplay';
import Calendar from '../Calendar/Calendar';
import { connect } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import '../../assets/css/pageFooter.css';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';

function Display(props) {
  const { roomIdSelected, fileSelected, sidebarSelectedItem, userId } = props;
  const [clicked, setClicked] = useState(false);
  
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
      autoClose: 2000,
    });
  const [form, setForm] = useState({
    Date: '',
    email: '',
    StartTime: '',
    roomTitle: '',
  });

  const handleClose = () => {
    setClicked(false);
  };
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // submit schedule meet for later data
  const handleSubmit = (e) => {
    e.preventDefault();
    const config = {
      headers: {
        'Content-Type': 'application/json',
        'x-auth-token': localStorage.token,
      },
    };

    const emailArr = form.email.split(',');
    const dateArr = form.Date.split('-');
    const timeArr = form.StartTime.split(':');
    const roomLink = `/room/`;
    let year = parseInt(dateArr[0]);
    let month = parseInt(dateArr[1]);
    let day = parseInt(dateArr[2]);
    let hours = parseInt(timeArr[0]);
    let minutes = parseInt(timeArr[1]);
    const finalTime = new Date(year, month - 1, day, hours, minutes);
    const EndTime = new Date(year, month - 1, day, hours + 1, minutes);

    const body = {
      roomLink,
      emailArr,
      roomName: form.roomTitle,
      isMeet: true,
      joinedUsers: [userId],
      StartTime: finalTime,
      EndTime,
    };

    notify(`Creating Meet`);

    axios
      .post(
        `${process.env.REACT_APP_API_URL}/api/chat/create-chat-meet-room`,
        body,
        config
      )
      .then((response) => {
        update(response.data.msg, response.data.type);
      })
      .catch((err) => console.log(err));

    setForm({
      Date: '',
      email: '',
      StartTime: '',
      roomTitle: '',
    });

    setClicked(false);

  };


  const myStyle = { marginLeft: '3.5%', width: '88vw', height: '72vh' };
  useEffect(() => {}, [roomIdSelected]);
  const classes = useStyles();
  return (
    <div className='display-div'>
      {sidebarSelectedItem === 'Calendar' && (
        <div style={myStyle}>
          <Calendar userId={userId} />
        </div>
      )}
      {roomIdSelected !== '' && <ChatRoom roomIdSelected={roomIdSelected} />}
      {fileSelected !== '' && <FileDisplay fileSelected={fileSelected} />}
      {sidebarSelectedItem === 'Video Call' && (
        <>
          {clicked ? (
            <Dialog
              open={clicked}
              fullWidth
              aria-labelledby='form-dialog-title'
            >
              <DialogTitle id='form-dialog-title'>Details</DialogTitle>
              <DialogContent>
                <TextField
                  autoFocus
                  margin='dense'
                  name='roomTitle'
                  label='Room Name'
                  type='text'
                  fullWidth
                  onChange={handleChange}
                />
              </DialogContent>
              <DialogContent>
                <input
                  id='i'
                  multiple
                  width='100%'
                  type='email'
                  name='email'
                  onChange={handleChange}
                  placeholder='Enter multiple emails(upto 9) separated by comma'
                ></input>
              </DialogContent>
              <DialogContent>
                <TextField
                  id='date'
                  label='Date'
                  name='Date'
                  onChange={handleChange}
                  type='date'
                  className={classes.textField}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
                <TextField
                  id='time'
                  label='Start Time'
                  onChange={handleChange}
                  type='time'
                  name='StartTime'
                  defaultValue={new Date().getTime()}
                  className={classes.textField}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  inputProps={{
                    step: 300, // 5 min
                  }}
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
          <div className='meet-button'>
            <div>
              <Link to='/loading' target='_blank'>
                <button style={{ marginLeft: '33%' }} className='b'>
                  Start An Instant Meeting
                </button>
              </Link>
            </div>
            <div onClick={() => setClicked(!clicked)}>
              <button className='b'>Schedule A Meeting For Later</button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

const useStyles = makeStyles((theme) => ({
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 200,
  },
}));

function mapStateToProps(state) {
  return {
    auth: state.auth,
  };
}

export default connect(mapStateToProps)(Display);
