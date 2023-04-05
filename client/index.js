// import React from "react";
import ReactDOM from "react-dom";
import App from './App';
import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

// ReactDOM.render(<App />, document.getElementById('root'));

const root = createRoot(document.getElementById("root"));
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);