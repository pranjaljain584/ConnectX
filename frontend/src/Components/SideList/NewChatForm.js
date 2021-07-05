import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import '../../assets/css/sidelistheader.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { io } from 'socket.io-client';

const socket = io.connect(`${process.env.REACT_APP_API_URL}`, {
  transports: ['websocket'],
});

export default function NewChatForm(props) {
  const [open, setOpen] = useState(false);
  const [roomTitle, setRoomTitle] = useState('');
  const { userId } = props;

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
      autoClose: 5000,
    });

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
    notify('Entering Room');
    socket.emit('create-room', { userId: userId, roomTitle: roomTitle });
    update('Room Created', 'success');
    setOpen(false);
  };

  return (
    <div>
      <button className='new-chat-btn' onClick={handleClickOpen}>
        New Chat
      </button>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby='form-dialog-title'
      >
        <DialogTitle id='form-dialog-title'>New Chat</DialogTitle>
        <DialogContent>
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
      <ToastContainer
        position='top-right'
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
}
