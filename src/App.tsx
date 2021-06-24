import React from 'react';
import { TournamentBoard } from './components/TournamentBoard';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <p>React tournament board</p>
        <TournamentBoard
          competitor={[
            [{ id: 'a' }, { id: 'b' }, { id: 'c' }],
            [{ id: 'd' }, { id: 'e' }],
          ]}
        />
      </header>
    </div>
  );
}

export default App;
