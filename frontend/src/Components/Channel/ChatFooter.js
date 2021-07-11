import React, { Component } from 'react';
import { connect } from 'react-redux';
import { io } from 'socket.io-client';
import '../../assets/css/chatfooter.css';
import SpeechToText from 'speech-to-text';
import {
  faMicrophone,
  faPaperPlane,
  faStopCircle,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import FileBase64 from '../File/FileBase64';

const socket = io.connect(`${process.env.REACT_APP_API_URL}`, {
  transports: ['websocket'],
});

class ChatFooter extends Component {
  state = {
    msg: '',
    error: '',
    interimText: '',
    finalisedText: [],
    listening: false,
    language: 'en-US',
    file: '',
    fileSelected: false,
  };

  getFile(file) {
    this.setState({ fileSelected: true });
    this.setState({ file });
  }

  handleChange = (e) => {
    this.setState({ msg: e.target.value });
  };

  handleSubmit = (e, roomIdSelected, userName, userId, file,userMail) => {
    e.preventDefault();
    var currentdate = new Date();
    var time = currentdate.getHours() + ':' + currentdate.getMinutes();
    if(this.state.msg.trim() !== '' || file!==''){
      socket.emit('send-msg', {
        userId,
        msgTime: time,
        msg: this.state.msg,
        userName,
        roomIdSelected,
        file,
        userMail,
      });
    }

    this.setState({ msg: '' , fileSelected:false,file:'' });
  };

  onAnythingSaid = (text) => {
    this.setState({ interimText: text });
  };

  onEndEvent = () => {
    if (this.state.listening) {
      this.startListening();
    }
  };

  onFinalised = (text) => {
    this.setState({
      finalisedText: [text, ...this.state.finalisedText],
      interimText: '',
    });
    var t = this.state.finalisedText[0];
    this.setState({ msg: t , fileSelected: false });
  };

  startListening = () => {
    try {
      this.listener = new SpeechToText(
        this.onFinalised,
        this.onEndEvent,
        this.onAnythingSaid,
        this.state.language
      );
      this.listener.startListening();
      this.setState({ listening: true });
    } catch (err) {
      console.log(err);
    }
  };

  stopListening = () => {
    this.listener.stopListening();
    this.setState({ listening: false });
  };

  componentDidUpdate = () => {};

  render() {
    const { msg, file, interimText, listening } =
      this.state;
    const { roomIdSelected } = this.props;
    const userId = this.props.auth.user?._id;
    const userName = this.props.auth.user?.name;
    const userMail = this.props.auth.user?.email;
    return (
      <div className='chat-footer'>
        <form>
          <div className='left'>
            <FileBase64 onDone={this.getFile.bind(this)} />
            {listening ? (
              <FontAwesomeIcon
                onClick={() => this.stopListening()}
                className='footer-icon '
                icon={faStopCircle}
              />
            ) : (
              <FontAwesomeIcon
                onClick={() => this.startListening()}
                className='footer-icon '
                icon={faMicrophone}
              />
            )}
          </div>

          {listening ? (
            <input
              type='text'
              placeholder={listening ? 'listening...' : 'finished listening'}
              value={interimText}
              onChange={(e) => this.handleChange(e)}
            ></input>
          ) : (
            <input
              type='text'
              placeholder='Type your message here...'
              required
              value={this.state.fileSelected ? `${file.name}` : msg }
              onChange={(e) => this.handleChange(e)}
            ></input>
          )}

          <button
            onClick={(e) =>
              this.handleSubmit(e, roomIdSelected, userName, userId, file,userMail)
            }
          >
            Send{' '}
            <FontAwesomeIcon className='footer-icon-send' icon={faPaperPlane} />
          </button>
        </form>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    auth: state.auth,
  };
}

export default connect(mapStateToProps)(ChatFooter);
