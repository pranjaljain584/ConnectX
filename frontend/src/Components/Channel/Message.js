import React from 'react';
import { connect } from 'react-redux';
import '../../assets/css/chatroom.css';
import ReactTooltip from 'react-tooltip';

function Message(props) {
  const { chatMessage, chatTime, userName, userId, fileName, base64String } =
    props.msg;
  const id = props.auth?.user?._id;
  // console.log(base64String);

  return (
    <div className={`msg-div ${userId === id ? ' msg-self' : ''}`}>
      <div className='msg-top'>{userId !== id ? userName : 'You'}</div>
      <div className='msg-mid'>
        {chatMessage}
        {fileName ? (
          <div
            data-tip='Click Here to Download'
            data-background-color='#497174'
            className='doc'
          >
            {' '}
            <a download href={base64String} target='_blank'>
              {fileName}
            </a>{' '}
          </div>
        ) : null}
      </div>

      <div className='msg-bottom'>{chatTime}</div>
      <ReactTooltip />
    </div>
  );
}

function mapStateToProps(state) {
  return {
    auth: state.auth,
  };
}

export default connect(mapStateToProps)(Message);
