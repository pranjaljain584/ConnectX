import React from 'react';

const Media = (props) => {
  const { id, vidLabel } = props;
  const handleDoubleClick = (e) => {
    let elem = document.getElementById(id) ;
    // console.log(elem) ;
    if (elem.requestFullscreen) {
      elem.requestFullscreen();
    } else if (elem.webkitRequestFullscreen) {
      /* Safari */
      elem.webkitRequestFullscreen();
    } else if (elem.msRequestFullscreen) {
      /* IE11 */
      elem.msRequestFullscreen();
    }
  }

  return (
    <>
      {' '}
      <video onDoubleClick={handleDoubleClick} id={id} autoPlay></video> <p className="label" >{vidLabel}</p>{' '}
    </>
  );
};

export default Media;
