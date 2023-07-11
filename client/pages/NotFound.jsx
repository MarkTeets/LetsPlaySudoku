import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <>
      <h3>Hey there, you look a little lost. Want some help getting back home?</h3>
      <div className='centered-div'>
        <Link to='/'>Take me home!</Link>
      </div>
    </>
  );
};

export default NotFound;