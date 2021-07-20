import React from 'react';
import { TournamentBoard } from '../../src/components/TournamentBoard';
import { competitors, matches } from './data';

const Baseball: React.VFC = () => (
  <div
    style={{
      width: '100%',
      padding: '2rem 0',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      background: '#268141',
      color: 'white',
    }}
  >
    <h2>Baseball</h2>
    <div style={{ maxWidth: '100%', overflowX: 'auto' }}>
      <TournamentBoard
        competitor={competitors}
        matches={matches}
        direction="vertical"
        bidirectionalTree
        leafDistance={26}
        groupDistance={0}
        leafPadding={100}
        rootPadding={60}
        boardSize={600}
        nodeRenderer={(props) =>
          props.isLeaf ? (
            <div
              style={{
                width: 100,
                padding: '0 4px',
                fontSize: 14,
                textAlignLast: 'justify',
                backgroundColor: '#41220c',
                borderRadius: 4,
              }}
            >
              {props.competitor?.name}
            </div>
          ) : (
            props.isRoot && (
              <div
                style={{
                  width: 50,
                  padding: '0 4px',
                  fontSize: 14,
                  textAlignLast: 'justify',
                  backgroundColor: '#41220c',
                  borderRadius: 4,
                }}
              >
                履正社
              </div>
            )
          )
        }
        matchingResultRenderer={(props) =>
          props.depth > 0 && (
            <div style={{ width: 15, fontSize: 10 }}>{props.result.score}</div>
          )
        }
        treeLinksLayerProps={{
          stroke: 'black',
          strokeWidth: 2,
        }}
        winnerLinksLayerProps={{
          stroke: 'white',
          strokeWidth: 2,
        }}
      />
    </div>
  </div>
);
export default Baseball;
