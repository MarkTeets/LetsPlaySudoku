import React from 'react';
import { Link, useRouteError } from 'react-router-dom';

const ErrorPage = () => {
  const error = useRouteError();

  return (
    <>
      <h2>Hey there, you look a little lost. Want some help getting back home?</h2>
      <Link to='/'>Take me home!</Link>
      <div>Error: {error.message}</div>
    </>
  );
};

export default ErrorPage;