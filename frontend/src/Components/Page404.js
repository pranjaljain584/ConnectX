import React from 'react';
import Background from '../assets/images/2634442.jpg';

function Page404() {
  return <div style={styles}></div>;
}

const styles = {
  width: '100%',
  height: '100vh',
  backgroundImage: `url(${Background})`,
  backgroundSize: 'contain',
  backgroundPositon: 'center',
  backgroundRepeat: 'no-repeat',
  backgroundColor: '#E9FCFF',
};

export default Page404;
