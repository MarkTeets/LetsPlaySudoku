import React from 'react';

// Types
import { SideBarProps } from '../../frontendTypes';

// Components
import SideBarSectionContainer from './SideBarSectionContainer';
import UserNavBar from './UserNavBar';
import GameSettings from './GameSettings';
import GameStats from '../../shared-components/GameStats';

const UserSideBar = (props: SideBarProps) => {
  return (
    <>
      <SideBarSectionContainer title='Navigation' defaultExpanded={true} key='Navigation Container'>
        <UserNavBar {...props} />
      </SideBarSectionContainer>
      <SideBarSectionContainer title='Settings' key='Settings Container'>
        <GameSettings />
      </SideBarSectionContainer>
      <SideBarSectionContainer title='Game Stats' key='Game Stats Container'>
        <GameStats />
      </SideBarSectionContainer>
    </>
  );
};

export default UserSideBar;
