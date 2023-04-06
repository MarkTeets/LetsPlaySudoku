import React, { useState, useEffect } from 'react';
import house from '../data/house.png'

function Home () {
  return (
    <div className='home-page'>
      <h1>This is my home!!!</h1>
        <img id='house-img' src={house} />
      <h1>Welcome everyone!</h1>
    </div>
    );
}

export default Home;