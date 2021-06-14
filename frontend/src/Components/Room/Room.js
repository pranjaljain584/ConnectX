import React from 'react';
import { useParams } from 'react-router';
import Media from './Media';

function Room(props) {
    console.log(props) ;
    const {roomId} = useParams() ;
    return (
        <div>
            this is meet room with room id ${roomId}
            <Media/>
        </div>
    );
}

export default Room;