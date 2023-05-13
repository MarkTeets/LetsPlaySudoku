import React, {useContext, useState} from "react";

function SignIn() {
  return ( 
    <div>
      <h1>Welcome Ye Humble Number Crunchers<br />It's time for Sudoku!</h1>
      <div>What's your name?</div>
      <form onSubmit={handleSubmit}>
        <input type="text" name="name" id="name" required />
        <input type="submit" value="Let's Go!"/>
      </form>
    </div>

   );
}

export default SignIn;

function handleSubmit(e) {
  e.preventDefault();

}