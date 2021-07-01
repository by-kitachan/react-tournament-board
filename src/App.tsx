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
            [
              [[{ id: 'y' }, { id: 't' }, { id: 'u' }]],
              [[{ id: 'a' }, { id: 'x' }], { id: 'y' }],
            ],
            [
              [[{ id: 'f' }, { id: 'p' }], { id: 'z' }],
              [
                [{ id: 'b' }, { id: 'c' }, { id: 'd' }, { id: 'e' }],
                { id: 'o' },
              ],
            ],
          ]}
        />
      </header>
    </div>
  );
}

export default App;
