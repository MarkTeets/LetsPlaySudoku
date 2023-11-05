import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className='centering-div error-page'>
      <h3>Hey there, you look a little lost. Want some help getting back home?</h3>
      <div>
        <Link to='/'>Take me home!</Link>
      </div>
    </div>
  );
};

export default NotFound;
