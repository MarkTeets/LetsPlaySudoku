import React from 'react';
import { Outlet } from 'react-router-dom';

// Types
import { SideBarContainerProps } from '../frontendTypes';

// Component
import SideBarContainer from './side-bar/SideBarContainer';

const TopBar = (props: SideBarContainerProps) => {
  return (
    <>
      <header id='header'>
        <div className='top-bar'>
          <div className='top-bar__left'>
            <img
              className='top-bar__sudoku-icon'
              src={'assets/sudoku-icon-64.png'}
              alt='sudoku-icon'
            />
            <span className='top-bar__page-title'>Let&apos;s Play Sudoku!</span>
          </div>
          <div className='top-bar__right'>
            <SideBarContainer {...props} />
          </div>
        </div>
      </header>
      <main>
        <Outlet />
      </main>
    </>
  );
};

export default TopBar;
