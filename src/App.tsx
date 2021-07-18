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
          nodeRenderer={(props) =>
            (props.isLeaf || props.children.length > 1) && (
              <div
                style={{
                  backgroundColor: props.isRoot ? 'cyan' : 'orange',
                  width: 20,
                  height: 20,
                }}
              >
                {props.match && props.match.winnerId}
                {props.isLeaf && props.competitor.id}
              </div>
            )
          }
          matchingResultRenderer={(props) => (
            <div
              style={{
                backgroundColor: props.isWinner ? 'red' : 'white',
                width: 10,
                height: 10,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              {props.result.score}
            </div>
          )}
          treeLinksLayerProps={{
            stroke: 'white',
            strokeLinejoin: 'round',
            strokeWidth: 2,
          }}
          winnerLinksLayerProps={{
            stroke: 'magenta',
            strokeLinejoin: 'round',
            strokeWidth: 4,
          }}
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
          matches={[
            {
              result: [
                { id: 'o', score: 120 },
                { id: 'q', score: 140 },
              ],
              winnerId: 'q',
            },
            {
              result: [
                { id: 'x', score: 200 },
                { id: 'u', score: 150 },
              ],
              winnerId: ['x'],
            },
            {
              result: [
                { id: 'x', score: 100 },
                { id: 'z', score: 100 },
              ],
              winnerId: 'x',
            },
            {
              result: [
                { id: 'b', score: 150 },
                { id: 'c', score: 120 },
                { id: 'd', score: 150 },
                { id: 'e', score: 90 },
              ],
              winnerId: ['b', 'd'],
            },
            {
              result: [
                { id: 'p', score: 100 },
                { id: 'z', score: 100 },
              ],
              winnerId: 'z',
            },
            {
              result: [
                { id: 's', score: 2 },
                { id: 'x', score: 1 },
              ],
              winnerId: 's',
            },
          ]}
        />
      </header>
    </div>
  );
}

export default App;
