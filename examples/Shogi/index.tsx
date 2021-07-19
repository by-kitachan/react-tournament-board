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
      background: '#ddbaa2',
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
              padding: '8px 4px',
              fontSize: 15,
              textAlign: 'start',
              background: props.allMatches.some(
                (match) => match.winnerId === props.competitor.id,
              )
                ? '#f7d370'
                : '#aaa',
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
