import React from 'react';
import house from '../data/house.png';

function Home () {
  return (
    <div className='home-page'>
      <h1>This is my home!!!</h1>
      <img id='house-img' src={house} alt='A house'/>
      <h1>Welcome everyone!</h1>
      <h2>Login functionality coming soon!</h2>
    </div>
  );
}

export default Home;