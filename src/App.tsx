import React from 'react';
import './App.css';

import Basketball from '../examples/Basketball';
import Baseball from '../examples/Baseball';
import Shogi from '../examples/Shogi';
import SmashBros from '../examples/SmashBros';

function App() {
  return (
    <div className="App">
      <header>
        <h1>React tournament board</h1>
        <a
          href="https://github.com/spring-raining/react-tournament-board"
          target="_blank"
          rel="noreferrer noopener"
        >
          <h3>GitHub</h3>
        </a>
      </header>
      <Basketball />
      <Baseball />
      <Shogi />
      <SmashBros />
    </div>
  );
}

export default App;
