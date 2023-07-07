import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <>
      <h2>Hey there, you look a little lost. Want some help getting back home?</h2>
      <Link to='/'>Take me home!</Link>
    </>
  );
};

export default NotFound;