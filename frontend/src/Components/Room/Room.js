import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { useParams } from 'react-router';
import { io } from 'socket.io-client';
import PropTypes from 'prop-types';
import Media from './Media';
import RoomHeader from './RoomHeader';
import RoomFooter from './RoomFooter';
import '../../assets/css/room.css';
import Messenger from './Messenger';
var localId;
var userName;
var userMail;

const socket = io.connect(`${process.env.REACT_APP_API_URL}`, {
  transports: ['websocket'],
});

var serverConnection;
var peerConnections = {};
var peerConnectionConfig = {
  iceServers: [
    { urls: 'stun:stun.stunprotocol.org:3478' },
    { urls: 'stun:stun.l.google.com:19302' },
  ],
};
var userTracksbyId = {};
var localStream;

function Room(props) {
  const { roomId } = useParams(); // act like my room name
  const [grid, setGrid] = useState([]);
  const [msg, setMsg] = useState('');
  const url = `${window.location.origin}${window.location.pathname}`;
  const [ChatRoomId, setChatRoomId] = useState('');
  const userEmail = props.auth.user?.email;
  const [screenCastStream, setScreenCastStream] = useState();
  const [myStream, setMyStream] = useState();
  const [isPresenting, setIsPresenting] = useState(false);
  const [isAudio, setIsAudio] = useState(true);
  const [isVideo, setIsVideo] = useState(true);
  const [incomingMsg, setIncomingMsg] = useState();
  const [head, selectHead] = useState('Chat');
  const [whiteboard,setWhiteboard] = useState(false) ;

  const handleSubmit = (e,board) => {
    var currentdate = new Date();
    var time = currentdate.getHours() + ':' + currentdate.getMinutes();
    if(board===true){
      console.log('here') ;
      socket.emit('video-msg', {
        msg: `Whiteboard ${whiteboard ? 'joined' : 'started'} by ${userName}`,
        user: userName,
        roomId,
        time,
        whiteboard:true ,
      });
    }else{
      e.preventDefault() ;
    }
    if (msg.trim() !== '') {
      socket.emit('video-msg', { msg, user: userName, roomId, time, whiteboard:false });
    }
    if (ChatRoomId != '' && msg.trim() !== '') {
      console.log('here');
      socket.emit('send-msg', {
        userId: localId,
        msgTime: time,
        msg,
        file: '',
        userName,
        roomIdSelected: ChatRoomId,
        userMail,
      });
    }
    setMsg('');
  };

  const toggleAudio = (value) => {
    myStream.getAudioTracks()[0].enabled = value;
    setIsAudio(value);
  };

  const toggleVideo = (value) => {
    myStream.getVideoTracks()[0].enabled = value;
    setIsVideo(value);
  };
  const disconnectCall = () => {
    props.history.push('/');
    window.location.reload();
  };
  const screenShare = () => {
    navigator.mediaDevices
      .getDisplayMedia({ cursor: true })
      .then((stream) => {
        console.log('Screen Share Stream', stream.getVideoTracks()[0]);
        setScreenCastStream(stream);
        let videoTrack = stream.getVideoTracks()[0];
        Object.keys(peerConnections).map(function (key) {
          var sender = peerConnections[key].pc.getSenders().find(function (s) {
            return s.track.kind == videoTrack.kind;
          });
          sender.replaceTrack(videoTrack);
        });

        setIsPresenting(true);
      })
      .catch((err) => console.log('Screen share error', err));
  };

  const stopScreenShare = () => {
    screenCastStream.getVideoTracks().forEach(function (track) {
      track.stop();
    });

    Object.keys(peerConnections).map(function (key) {
      let video = localStream.getVideoTracks()[0];
      var sender = peerConnections[key].pc.getSenders().find(function (s) {
        return s.track.kind == video.kind;
      });
      sender.replaceTrack(video);
    });

    setIsPresenting(false);
  };

  const gotMessageFromServer = (message) => {
    var signal = message;
    var peerId = signal.id;

    if (
      peerId == localId ||
      (signal.dest != localId && signal.dest != roomId)
    ) {
      return;
    }

    if (signal.initCaller && signal.dest == roomId) {
      // set up peer connection object for a newcomer peer
      setUpPeer(peerId, signal.initCaller, signal.displayName);
      serverConnection.emit('message', {
        initCaller: true,
        id: localId,
        displayName: userName,
        dest: peerId,
      });
      // notify(signal.displayName) ;
    } else if (signal.initCaller && signal.dest == localId) {
      // initiate call if we are the newcomer peer
      setUpPeer(peerId, signal.initCaller, signal.displayName, true);
    } else if (signal.sdp) {
      peerConnections[peerId].pc
        .setRemoteDescription(new RTCSessionDescription(signal.sdp))
        .then(function () {
          // Only create answers in response to offers
          if (signal.sdp.type == 'offer') {
            peerConnections[peerId].pc
              .createAnswer()
              .then((description) => createdDescription(description, peerId))
              .catch((err) => console.log('***', err));
          }
        })
        .catch((err) => console.log('***----', err));
    } else if (signal.ice) {
      peerConnections[peerId].pc
        .addIceCandidate(new RTCIceCandidate(signal.ice))
        .catch((err) => console.log('**%%%*', err));
    }
  };

  const setUpPeer = (peerId, initCaller, displayName, initCall = false) => {
    peerConnections[peerId] = {
      initCaller: true,
      pc: new RTCPeerConnection(peerConnectionConfig),
      displayName: displayName,
    };

    peerConnections[peerId].pc.onicecandidate = (event) =>
      gotIceCandidate(event, peerId);
    peerConnections[peerId].pc.ontrack = (event) =>
      gotRemoteStream(event, peerId);
    peerConnections[peerId].pc.oniceconnectionstatechange = (event) =>
      checkPeerDisconnect(event, peerId);

    peerConnections[peerId].pc.addStream(localStream);

    if (initCall) {
      peerConnections[peerId].pc
        .createOffer()
        .then((description) => createdDescription(description, peerId))
        .catch((err) => console.log('***&&&&', err));
    }
  };

  const gotIceCandidate = (event, peerId) => {
    if (event.candidate != null) {
      serverConnection.send({
        ice: event.candidate,
        id: localId,
        displayNameL: userName,
        dest: peerId,
      });
    }
  };

  function createdDescription(description, peerId) {
    console.log(`got description, peer ${peerId}`);
    peerConnections[peerId].pc
      .setLocalDescription(description)
      .then(function () {
        serverConnection.emit('message', {
          sdp: peerConnections[peerId].pc.localDescription,
          id: localId,
          dest: peerId,
        });
      })
      .catch((err) => console.log('**###*', err));
  }

  const gotRemoteStream = (event, peerId) => {
    // let numVideos = Object.keys(peerConnections).length + 1;

    userTracksbyId[peerId] = {
      audio: event.streams[0].getAudioTracks(),
      video: event.streams[0].getVideoTracks(),
    };

    console.log(userTracksbyId, 'STREAM ARRAY');

    setGrid((prevState) => {
      return [
        ...prevState.filter((e) => {
          return e.id != peerId;
        }),
        {
          id: peerId,
          element: React.createElement(
            'div',
            { id: `peer-${peerId}`, className: 'video-container' },
            [
              <Media
                vidLabel={peerConnections[peerId].displayName}
                id={`remoteVideo_${peerId}`}
              />,
            ]
          ),
        },
      ];
    });

    document.getElementById(`remoteVideo_${peerId}`).srcObject =
      event.streams[0];

    updateLayout();
  };

  const checkPeerDisconnect = (event, peerId) => {
    var state = peerConnections[peerId].pc.iceConnectionState;
    console.log(`connection with peer ${peerId} ${state}`);
    if (state === 'failed' || state === 'closed' || state === 'disconnected') {
      delete peerConnections[peerId];
      let node = document.getElementById('remoteVideo_' + peerId);
      let parent = document.getElementById('video-container');
      if (parent) {
        parent.removeChild(node);
      }
      updateLayout();
    }
  };

  const updateLayout = () => {
    var Height = '';
    var Width = '';

    var numVideos = Object.keys(peerConnections).length + 1;

    if (numVideos == 1) {
      Height = '100%';
      Width = '100%';
    } else if (numVideos == 2) {
      Height = '100%';
      Width = '50%';
    } else if (numVideos > 2 && numVideos <= 4) {
      Height = '50%';
      Width = '50%';
    } else if (numVideos > 4 && numVideos <= 6) {
      Height = '33%';
      Width = '50%';
    } else {
      Height = '33%';
      Width = '33%';
    }

    document.documentElement.style.setProperty(`--Height`, Height);
    document.documentElement.style.setProperty(`--Width`, Width);
  };

  const start = async () => {
    var constraints = {
      video: {
        frameRate: { max: 30 },
      },
      audio: true,
    };

    if (navigator.mediaDevices.getUserMedia) {
      try {
        var stream = await navigator.mediaDevices.getUserMedia(constraints);

        console.log(stream, 'stream');
        localStream = stream;
        document.getElementById('own-video').srcObject = stream;

        serverConnection = socket;
        // serverConnection.removeAllListeners('') ;
        serverConnection.removeAllListeners('message');
        serverConnection.on('message', gotMessageFromServer);
        serverConnection.emit('message', {
          initCaller: true,
          id: localId,
          displayName: userName,
          dest: roomId,
        });
      } catch (error) {
        console.log('Get user media error -->>', error);
      }
    } else {
      alert('Your browser does not support getUserMedia API');
    }

    setMyStream(localStream);
  };

  useEffect(() => {
    const obj = JSON.parse(localStorage.userDet);
    console.log(obj);
    localId = obj.user.id;
    userName = obj.user.name;
    userMail = obj.user.email;
    start();
    if (!roomId.includes('-')) {
      setChatRoomId(roomId);
    }
    updateLayout();
  }, []);

  useEffect(() => {
    socket.removeAllListeners(`${roomId}-video-msg`);
    socket.on(`${roomId}-video-msg`, (data) => {
      console.log('Data', data);
      setIncomingMsg(data);
      if(data.whiteboard){
        setWhiteboard(true) ;
      }
    });
  }, [msg]);

  return (
    <div className='room'>
      <div id='videos' className='video-grid'>
        <div className='video-container'>
          {' '}
          <video id='own-video' muted autoPlay></video>{' '}
          <p className='label'>You</p>
        </div>

        {grid.map((g, key) => {
          return g.element;
        })}
      </div>

      <RoomHeader head={head} selectHead={selectHead} />
      <Messenger
        head={head}
        msg={msg}
        setMsg={setMsg}
        participants={peerConnections}
        handleSubmit={handleSubmit}
        incomingMsg={incomingMsg}
        roomId={roomId}
      />
      <RoomFooter
        isPresenting={isPresenting}
        stopScreenShare={stopScreenShare}
        screenShare={screenShare}
        isAudio={isAudio}
        toggleAudio={toggleAudio}
        isVideo={isVideo}
        toggleVideo={toggleVideo}
        disconnectCall={disconnectCall}
        url={url}
        roomId={roomId}
        userName={userName}
        userEmail={userEmail}
        handleSubmit={handleSubmit}
      />
    </div>
  );
}

Room.propTypes = {
  auth: PropTypes.object.isRequired,
};

function mapStateToProps(state) {
  return {
    auth: state.auth,
  };
}

export default connect(mapStateToProps)(Room);
