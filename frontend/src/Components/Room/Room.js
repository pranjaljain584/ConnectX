import React, { useEffect, useReducer, useState } from 'react';
import { useParams } from 'react-router';
import { getRequest, postRequest } from '../../utils/apiRequests';
import { BASE_URL, GET_CALL_ID, SAVE_CALL_ID } from '../../utils/apiEndPoints';
import Media from './Media';
import { io } from 'socket.io-client';
import RoomHeader from './RoomHeader';
import RoomFooter from './RoomFooter';
import MeetingInfo from './MeetingInfo';
import Messenger from './Messenger';
import '../../assets/css/room.css';
import MessageListReducer from '../../reducers/MessageListReducer';
import Peer from 'simple-peer';
import { faVideoSlash } from '@fortawesome/free-solid-svg-icons';

const socket = io.connect('http://localhost:5000', {
  transports: ['websocket'],
});
// socket.on('connect_error', (err) => {
//   console.log(`connect_error due to ${err.message}`);
// });
const initialState = [];
let peer = null;

function Room(props) {
  const { roomId } = useParams();
  const isAdmin = window.location.hash === '#init' ? true : false;
  const url = `${window.location.origin}${window.location.pathname}`;
  let alertTimeout = null;

  const [messageList, messageListReducer] = useReducer(
    MessageListReducer,
    initialState
  );

  const [streamObj, setStreamObj] = useState();
  const [screenCastStream, setScreenCastStream] = useState();
  const [isPresenting, setIsPresenting] = useState(false);
  const [isMessenger, setIsMessenger] = useState(false);
  const [messageAlert, setMessageAlert] = useState({});
  const [isAudio, setIsAudio] = useState(true);
  const [isVideo, setIsVideo] = useState(true);

  useEffect(() => {
    initWebRTC();
    socket.on('code', (data) => {
      peer.signal(data);
      console.log('Peer Signalled data');
    });
  }, []);

  const getReceiverCode = async () => {
    const response = await getRequest(`${BASE_URL}${GET_CALL_ID}/${roomId}`);
    if (response.code) {
      peer.signal(response.code);
      console.log('Peer Signalled data');
    }
  };

  const initWebRTC = () => {
    navigator.mediaDevices
      .getUserMedia({
        video: true,
        audio: true,
      })
      .then((stream) => {
        setStreamObj(stream);
        peer = new Peer({
          initiator: isAdmin,
          trickle: false,
          stream: stream,
        });

        if (!isAdmin) {
          getReceiverCode();
        }

        peer.on('signal', async (data) => {
          if (isAdmin) {
            let payload = {
              roomId,
              signalData: data,
            };
            await postRequest(`${BASE_URL}${SAVE_CALL_ID}`, payload);
          } else {
            socket.emit('code', data, (callbackData) => {
              console.log('code sent');
            });
          }
        });

        peer.on('connect', () => {
          console.log('peer connected');
        });

        peer.on('stream', async (stream) => {
          let video = document.getElementById('video');

          if ('srcObject' in video) {
            const mediaStream = await navigator.mediaDevices.getUserMedia({
              video: true,
            });
            video.srcObject = stream;
            video.load();
          } else {
            video.src = window.URL.createObjectURL(stream);
          }

          video.play();
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const screenShare = () => {
    navigator.mediaDevices
      .getDisplayMedia({ cursor: true })
      .then((screenStream) => {
        peer.replaceTrack(
          streamObj.getVideoTracks()[0],
          screenStream.getVideoTracks()[0],
          streamObj
        );
        setScreenCastStream(screenStream);
        screenStream.getTracks()[0].onended = () => {
          peer.replaceTrack(
            screenStream.getVideoTracks()[0],
            streamObj.getVideoTracks()[0],
            streamObj
          );
        };
        setIsPresenting(true);
      });
  };

  const stopScreenShare = () => {
    screenCastStream.getVideoTracks().forEach(function (track) {
      track.stop();
    });
    peer.replaceTrack(
      screenCastStream.getVideoTracks()[0],
      streamObj.getVideoTracks()[0],
      streamObj
    );
    setIsPresenting(false);
  };

  const toggleAudio = (value) => {
    streamObj.getAudioTracks()[0].enabled = value;
    setIsAudio(value);
  };

  const toggleVideo = (value) => {
    streamObj.getVideoTracks()[0].enabled = value;
    setIsVideo(value);
  };

  const disconnectCall = () => {
    peer.destroy();
    props.history.push('/');
    window.location.reload();
  };

  console.log('IS ADMIN', isAdmin);

  return (
    <div className='room'>
      <div className='video-grid'>
        <Media isVideo={isVideo} />
        <video className='video-container' id='video' src='' autoPlay></video>
      </div>
      <RoomHeader />
      <RoomFooter
        isPresenting={isPresenting}
        stopScreenShare={stopScreenShare}
        screenShare={screenShare}
        isAudio={isAudio}
        toggleAudio={toggleAudio}
        isVideo={isVideo}
        toggleVideo={toggleVideo}
        disconnectCall={disconnectCall}
      />
      {/* {isAdmin && <MeetingInfo url={url} />} */}
      {/* <Messenger /> */}
      {/* this is meet room with room id {roomId} and {url} */}
      {/* <Media isVideo={isVideo} /> */}
    </div>
  );
}

export default Room;
