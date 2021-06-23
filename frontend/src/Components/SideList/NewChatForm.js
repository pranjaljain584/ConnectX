import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import '../../assets/css/sidelistheader.css';
import { io } from 'socket.io-client';

const socket = io.connect('http://localhost:5000', {
  transports: ['websocket'],
});

export default function NewChatForm(props) {
  const [open, setOpen] = useState(false);
  const [roomTitle, setRoomTitle] = useState('');
  const {userId} = props ;

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const handleChange = (e) => {
    setRoomTitle(e.target.value);
  };

  const handleSubmit = () => {

    socket.emit('create-room',{userId:userId , roomTitle:roomTitle})

    setOpen(false);

    // console.log(roomTitle);
  };

  return (
    <div>
      <button className="new-chat-btn" onClick={handleClickOpen}>
        New Chat
      </button>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby='form-dialog-title'
      >
        <DialogTitle id='form-dialog-title'>New Chat</DialogTitle>
        <DialogContent>
          <DialogContentText>
            To subscribe to this website, please enter your email address here.
            We will send updates occasionally.
          </DialogContentText>
          <TextField
            autoFocus
            margin='dense'
            id='roomTitle'
            label='Channel Name'
            type='text'
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
    </div>
  );
}
