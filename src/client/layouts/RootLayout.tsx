import React from 'react';
import { Outlet } from 'react-router-dom';

const RootLayout = () => {
  return (
    <div id='root-layout'>
      <Outlet />
    </div>
  );
};

export default RootLayout;
