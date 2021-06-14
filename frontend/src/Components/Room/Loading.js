import React from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import "../../css/loading.css"
function Loading(props) {
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