import React from 'react';
import { Link, useRouteError } from 'react-router-dom';

const ErrorPage = () => {
  const error = useRouteError() as Error;

  return (
    <div className='centering-div error-page'>
      <h3>Hey there, you look a little lost. Want some help getting back home?</h3>
      <p className='error-page__message'>
        Error:{' '}
        {error
          ? error.message
          : 'A sample error message that could be much longer than this. It could go on for several lines. It could keep going forever and ever and ever.'}
      </p>
      <Link to='/'>Take me home!</Link>
    </div>
  );
};

export default ErrorPage;
