import React from 'react';
import './App.css';

import Basketball from '../examples/Basketball';
import Baseball from '../examples/Baseball';
import Shogi from '../examples/Shogi';

function App() {
  return (
    <div className="App">
      <h1>React tournament board</h1>
      <Basketball />
      <Baseball />
      <Shogi />
    </div>
  );
}

export default App;
