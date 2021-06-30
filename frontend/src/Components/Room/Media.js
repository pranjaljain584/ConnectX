import React, { useEffect, useState } from 'react';

const Media = (props) => {
  const { id } = props;

  return <video id={id} autoPlay></video>;
};

export default Media;
