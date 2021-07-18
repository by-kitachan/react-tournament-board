import { match } from 'assert';
import React from 'react';
import { TournamentBoard } from '../../src/components/TournamentBoard';
import { competitors, matches } from './data';

const Shogi: React.VFC = () => (
  <div
    style={{
      width: '100%',
      padding: '2rem 0',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      background: '#e0b887',
      color: 'black',
    }}
  >
    <h2>Shogi</h2>
    <TournamentBoard
      competitor={competitors}
      matches={matches}
      direction="horizontal"
      leafPadding={120}
      rootPadding={0}
      leafDistance={50}
      groupDistance={0}
      nodeRenderer={(props) =>
        props.isLeaf && (
          <div
            style={{
              height: 120,
              padding: '4px',
              fontSize: 15,
              textAlign: 'start',
              background: '#f7e1c4',
              borderRadius: 4,
              writingMode: 'vertical-lr',
            }}
          >
            {props.competitor?.name}
          </div>
        )
      }
      treeLinksLayerProps={{
        strokeWidth: 2,
        stroke: '#555',
      }}
      winnerLinksLayerProps={{
        strokeWidth: 5,
        stroke: '#ca2009',
      }}
    />
  </div>
);
export default Shogi;
