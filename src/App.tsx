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
          nodeRenderer={(props) =>
            (props.isLeaf || props.children.length > 1) && (
              <div
                style={{
                  backgroundColor: props.isRoot ? 'cyan' : 'orange',
                  width: 20,
                  height: 20,
                }}
              >
                {props.isLeaf && props.competitor.id}
              </div>
            )
          }
          competitor={[
            [
              [[{ id: 'f' }, { id: 'p' }], [{ id: 'z' }]],
              [
                [{ id: 'b' }, { id: 'c' }, { id: 'd' }, { id: 'e' }],
                [{ id: 'o' }, { id: 'q' }],
              ],
            ],
            [
              [[{ id: 'y' }, { id: 't' }, { id: 'u' }]],
              [{ id: 's' }, [{ id: 'a' }, { id: 'x' }]],
            ],
          ]}
        />
      </header>
    </div>
  );
}

export default App;
