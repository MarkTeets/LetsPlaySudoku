import React from 'react';
import house from '../../assets/house.png';

const Home = () => {
  return (
    <div className='home-page'>
      <h1>This is my home!!!</h1>
      <img id='house-img' src={house} alt='A house' />
      <h1>Welcome everyone!</h1>
    </div>
  );
};

export default Home;
