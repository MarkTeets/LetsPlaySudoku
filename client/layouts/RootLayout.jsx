import React from 'react';
import { Outlet } from 'react-router-dom';

function RootLayout() {
  return ( 
    <div className="root-layout">
      <header>
        <div>root</div>
      </header>
      <main>
        <Outlet/>
      </main>
    </div>
  );
}

export default RootLayout;