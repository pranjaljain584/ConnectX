import React from 'react';
import '../../assets/css/filedisplay.css' ;

function FileDisplay(props) {

const fileBase64String = props.fileSelected;

  return (
    <div className="file-display">
        <iframe src={fileBase64String} title="" />
    </div>
  );
}

export default FileDisplay;
