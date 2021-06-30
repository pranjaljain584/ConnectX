import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { useParams } from 'react-router';
import { io } from 'socket.io-client';
import PropTypes from 'prop-types';
import jwt_decode from 'jwt-decode';
import Media from './Media';
import RoomHeader from './RoomHeader';
import RoomFooter from './RoomFooter';
import '../../assets/css/room.css';

const socket = io.connect('http://localhost:5000', {
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

if (localStorage.token) {
  const token = localStorage.token;
  const decoded = jwt_decode(token);
  console.log(decoded);
  var localId = decoded.user.id;
}

function Room(props) {
  const { roomId } = useParams(); // act like my room name
  const [grid, setGrid] = useState([]);
  const peers = Object.keys(peerConnections).length;
  const [screenCastStream, setScreenCastStream] = useState();
  const [myStream, setMyStream] = useState();
  const [isPresenting, setIsPresenting] = useState(false);
  const [isAudio, setIsAudio] = useState(true);
  const [isVideo, setIsVideo] = useState(true);

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
      let video = localStream.getVideoTracks()[0] ;
      var sender = peerConnections[key].pc.getSenders().find(function (s) {
        return s.track.kind == video.kind;
      });
      sender.replaceTrack(video);
    });

    setIsPresenting(false);
  };

  const gotMessageFromServer = (message) => {
    // console.log('Message receive from server:', message);
    var signal = message;
    // console.log('Json oarsed message:', signal);
    var peerId = signal.id;

    if (
      peerId == localId ||
      (signal.dest != localId && signal.dest != roomId)
    ) {
      return;
    }

    if (signal.initCaller && signal.dest == roomId) {
      // set up peer connection object for a newcomer peer
      setUpPeer(peerId, signal.initCaller);
      serverConnection.emit('message', {
        initCaller: true,
        id: localId,
        dest: peerId,
      });
    } else if (signal.initCaller && signal.dest == localId) {
      // initiate call if we are the newcomer peer
      setUpPeer(peerId, signal.initCaller, true);
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

  const setUpPeer = (peerId, initCaller, initCall = false) => {
    // console.log('HEREEEEEE');
    peerConnections[peerId] = {
      initCaller: true,
      pc: new RTCPeerConnection(peerConnectionConfig),
    };
    peerConnections[peerId].pc.onicecandidate = (event) =>
      gotIceCandidate(event, peerId);
    peerConnections[peerId].pc.ontrack = (event) =>
      gotRemoteStream(event, peerId);
    peerConnections[peerId].pc.oniceconnectionstatechange = (event) =>
      checkPeerDisconnect(event, peerId);

    console.log(localStream);
    peerConnections[peerId].pc.addStream(localStream);

    if (initCall) {
      console.log('INITTTT');
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
    // console.log(event.streams[0]);
    console.log('CALLED');

    userTracksbyId[peerId] = {
      audio: event.streams[0].getAudioTracks(),
      video: event.streams[0].getVideoTracks(),
    };

    console.log(userTracksbyId, 'STREAM ARRAY');
    // console.log(localId);

    setGrid((prevState) => {
      return [
        ...prevState,
        React.createElement(
          'div',
          { id: 'peers', className: 'video-container' },
          [<Media id={`remoteVideo_${peerId}`} />]
        ),
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
      document
        .getElementById('peers')
        .removeChild(document.getElementById('remoteVideo_' + peerId));
      updateLayout();
    }
  };

  const updateLayout = () => {
    var rowHeight = '';
    var colWidth = '';

    var numVideos = Object.keys(peerConnections).length + 1;

    if (numVideos > 1 && numVideos <= 4) {
      // 2x2 grid
      rowHeight = '200px';
      colWidth = '200px';
    } else if (numVideos > 4) {
      // 3x3 grid
      rowHeight = '100px';
      colWidth = '100px';
    }

    document.documentElement.style.setProperty(`--rowHeight`, rowHeight);
    document.documentElement.style.setProperty(`--colWidth`, colWidth);
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
        serverConnection.removeAllListeners('message');
        serverConnection.on('message', gotMessageFromServer);
        serverConnection.emit('message', {
          initCaller: true,
          id: localId,
          dest: roomId,
        });
      } catch (error) {
        console.log('Get user media error -->>', error);
      }
    } else {
      alert('Your browser does not support getUserMedia API');
    }

    console.log(localStream, 'LOCAL STREAM');
    setMyStream(localStream);
  };

  useEffect(() => {
    start();
  }, []);

  console.log(myStream?.getAudioTracks(), 'MYYYY');

  return (
    <div className='room'>
      <div id='videos' className='video-grid'>
        <div className='video-container'>
          {' '}
          <video id='own-video' muted autoPlay></video>{' '}
        </div>

        {grid.map((g, key) => {
          return g;
        })}
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

      {/* <h1>{Object.keys(peerConnections).length}</h1> */}
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

// const initialState = [];
// let peer = null;

// function Room(props) {
//   const { roomId } = useParams();
//   const isAdmin = window.location.hash === '#init' ? true : false;
//   const url = `${window.location.origin}${window.location.pathname}`;
//   let alertTimeout = null;

//   return (
//     <div className='room'>
//       <div className='video-grid'>
//         <Media isVideo={isVideo} />
//         <video className='video-container' id='video' src='' autoPlay></video>
//       </div>
//       {/* {isAdmin && <MeetingInfo url={url} />} */}
//       {/* <Messenger /> */}
//       {/* this is meet room with room id {roomId} and {url} */}
//       {/* <Media isVideo={isVideo} /> */}
//     </div>
//   );
// }
