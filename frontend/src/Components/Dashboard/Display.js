import React, { useEffect, useState } from 'react';
import '../../assets/css/display.css';
import { Link } from 'react-router-dom';
import ChatRoom from '../Channel/ChatRoom';
import FileDisplay from '../File/FileDisplay';
import Calendar from '../Calendar/Calendar';
import { connect } from 'react-redux';
import '../../assets/css/pageFooter.css';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';

function Display(props) {
  const { roomIdSelected, fileSelected, sidebarSelectedItem } = props;
  const [clicked, setClicked] = useState(false);
  const [form, setForm] = useState({
    roomTitle:'' ,
    email:''
  });
  const handleClose = () => {
    setClicked(false);
  };
  const handleChange = (e) => {
    setForm( { ...form ,[e.target.name]:e.target.value } );
    console.log(form) ;
  };

  const handleSubmit = (e) => {
    e.preventDefault() ;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        'x-auth-token': localStorage.token,
      },
    };


  };

  const myStyle = { marginLeft: '3.5%', width: '88vw', height: '70vh' };
  useEffect(() => {}, [roomIdSelected]);
  return (
    <div className='display-div' >
      {sidebarSelectedItem == 'Calendar' && (
        <div style={myStyle}>
          <Calendar userId={props.auth?.user.id} />
        </div>
      )}
      {roomIdSelected !== '' && <ChatRoom roomIdSelected={roomIdSelected} />}
      {fileSelected !== '' && <FileDisplay fileSelected={fileSelected} />}
      {sidebarSelectedItem == 'Video Call' && (
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
                <button className='b'>Start A New Meeting</button>
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

function mapStateToProps(state) {
  return {
    auth: state.auth,
  };
}

export default connect(mapStateToProps)(Display);
