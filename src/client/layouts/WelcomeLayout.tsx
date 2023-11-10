import React from 'react';

// Components
import TopBar from './TopBar';
import WelcomeNavBar from './side-bar/WelcomeNavBar';

// Main Component
const WelcomeLayout = () => {
  return <TopBar SideBar={WelcomeNavBar} />;
};

export default WelcomeLayout;
