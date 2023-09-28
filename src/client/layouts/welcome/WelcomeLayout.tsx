import React from 'react';
import { Outlet } from 'react-router-dom';

// Components
import SideBarContainer from '../../shared-components/SideBarContainer';
import WelcomeNavBar from './components/WelcomeNavBar';

// Main Component
const WelcomeLayout = () => {
  return (
    <>
      <header>
        <SideBarContainer SideBar={WelcomeNavBar} />
      </header>
      <main>
        <Outlet />
      </main>
    </>
  );
};

export default WelcomeLayout;
