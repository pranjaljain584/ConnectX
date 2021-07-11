import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import CircularProgress from '@material-ui/core/CircularProgress';
import '../../assets/css/loading.css';
import { connect } from 'react-redux';
import axios from 'axios';

function ChatRoomJoining(props) {
  const { chatRoomId } = useParams();
  const userId = props.auth.user?._id;

  useEffect(() => {
    const config = {
      headers: {
        'Content-Type': 'application/json',
        'x-auth-token': localStorage.token,
      },
    };

    const data = new FormData();
    data.append('userId', userId);

    axios
      .post(
        `${process.env.REACT_APP_API_URL}/api/chat/invite/${chatRoomId}`,
        data,
        config
      )
      .then((response) => {
        if (response.data.success) {
          props.history.push(`/dashboard`);
        } else {
          props.history.push(`/error`);
        }
      })
      .catch((err) => console.log(err));
      
  }, []);

  return (
    <div id='loading-bg'>
      <h1>Joining..</h1>
      <br />
      <p>
        <CircularProgress color='primary' />
      </p>
    </div>
  );
}

function mapStateToProps(state) {
  return {
    auth: state.auth,
  };
}

export default connect(mapStateToProps)(ChatRoomJoining);
