import React, { useEffect, useState } from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import "../../assets/css/loading.css" ;
import uuid from 'react-uuid' ;

function Loading(props) {

    const[roomId,setRoomId] = useState("") ;

    useEffect(()=>{
        setRoomId(uuid()) ;
    },[]) ;

    // redirecting user to room with room id created while loading phase
    if(roomId !== "") props.history.push(`/room/${roomId}`);

    return (
      <div id='loading-bg'>
        <h1>Loading..</h1>
        <br />
        <p>
          <CircularProgress color='primary' />
        </p>
      </div>
    );
}

export default Loading;