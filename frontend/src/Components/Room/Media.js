import React, { useEffect, useState } from 'react';

var localVideoref = React.createRef();

const Media = (props) => {

    useEffect(() => {
      var constraints = {
        video: true,
        audio: true,
      };
      async function getMedia(constraints) {
        let stream = null;
        try {
          stream = await navigator.mediaDevices.getUserMedia(constraints);
          // console.log(stream.getAudioTracks()[0].getCapabilities()) ;
          localVideoref.current.srcObject = stream;
          localVideoref.current.muted = true;
        //   addVideoStream()
        } catch (err) {
          /* handle the error */
          console.log('****', err);
        }
      }

      getMedia(constraints);

    }, []);

  return (
    <div>
      peer component
      <video className="video-grid" ref={localVideoref} autoPlay></video>
    </div>
  );
};

export default Media;
