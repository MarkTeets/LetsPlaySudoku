import React from 'react';
import { Link, useRouteError } from 'react-router-dom';

const ErrorPage = () => {
  const error = useRouteError() as Error;

  return (
    <>
      <h3>Hey there, you look a little lost. Want some help getting back home?</h3>
      <div className='centered-div'>
        <Link to='/'>Take me home!</Link>
        <div>Error: {error.message}</div>
      </div>
    </>
  );
};

export default ErrorPage;
