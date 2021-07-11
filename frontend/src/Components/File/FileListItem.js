import {
  faFileCode,
  faFile,
  faFilePdf,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import '../../assets/css/filelistitem.css';

function FileListItem(props) {
  const { setFileSelected,setRoomIdSelected } = props;
  const { file } = props;
  const fileType = file.name.split('.')[1];
  const iconName =
    fileType === 'pdf' ? faFilePdf : fileType === 'cpp' ? faFileCode : faFile;
  return (
    <div
      className='file-list-item'
      onClick={() => {
        setFileSelected(file.base64String);
        setRoomIdSelected('') ;
      }}
    >
      <FontAwesomeIcon className='file-icon' icon={iconName} />
      <div>
        {' '}
        <h5>{file.name}</h5>{' '}
      </div>
    </div>
  );
}

export default FileListItem;
