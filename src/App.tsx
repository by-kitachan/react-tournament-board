import React from 'react';
import { TournamentBoard } from './components/TournamentBoard';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <p>React tournament board</p>
        <TournamentBoard
          direction="horizontal"
          bidirectionalTree
          nodeRenderer={() => (
            <div
              style={{ backgroundColor: 'orange', width: 20, height: 20 }}
            ></div>
          )}
          competitor={[
            [
              [[{ id: 'y' }, { id: 't' }, { id: 'u' }]],
              [[{ id: 's' }], [{ id: 'a' }, { id: 'x' }]],
            ],
            [
              [[{ id: 'f' }, { id: 'p' }], [{ id: 'z' }]],
              [
                [{ id: 'b' }, { id: 'c' }, { id: 'd' }, { id: 'e' }],
                [{ id: 'o' }, { id: 'q' }],
              ],
            ],
          ]}
        />
      </header>
    </div>
  );
}

export default App;
