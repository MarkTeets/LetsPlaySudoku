import React from 'react';

//Components
import SiteInfo from '../../shared-components/SiteInfo';

// Main Component
const About = () => {
  return (
    <div className='home-page'>
      <h1 id='lets-play'>{"Let's Play Sudoku!"}</h1>
      <h2>Welcome everyone!</h2>
      <SiteInfo key='SiteInfo' />
    </div>
  );
};

export default About;
