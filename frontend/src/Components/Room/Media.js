import React, { useEffect, useState } from 'react';

const Media = (props) => {
  const { id, vidLabel } = props;

  return (
    <>
      {' '}
      <video id={id} autoPlay></video> <p className="label" >{vidLabel}</p>{' '}
    </>
  );
};

export default Media;
