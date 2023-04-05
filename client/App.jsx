import React, { Component } from 'react';
import Users from './components/User';
import PuzzlePageContainer from './components/gameplay/PuzzlePageContainer';


const App = () => {
  return (
    <div>
        <h1>Hello world!</h1>
        {/* <Users /> */}
        <PuzzlePageContainer/>
      </div>
  )
}




class App1 extends Component {
  render() {
    return (
      <div>
        <h1>Hello world!</h1>
        {/* <Users /> */}
        
      </div>
    )
  }
}

export default App;