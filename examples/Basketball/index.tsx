import { match } from 'assert';
import React from 'react';
import { TournamentBoard } from '../../src/components/TournamentBoard';
import { competitors, teamNames, matches } from './data';

const Basketball: React.VFC = () => (
  <div
    style={{
      width: '100%',
      padding: '2rem 0',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      background: '#f0ce35',
      color: 'black',
    }}
  >
    <h2>Basketball</h2>
    <TournamentBoard
      competitor={competitors}
      matches={matches}
      direction="vertical"
      leafDistance={29}
      groupDistance={15}
      leafPadding={0}
      rootPadding={50}
      boardSize={1000}
      ascenderLinkLengthRatio={0.8}
      descenderLinkLengthRatio={0.2}
      nodeRenderer={(props) =>
        props.isRoot && (
          <div
            style={{
              position: 'relative',
              width: 180,
              padding: '4px 6px',
              fontSize: 14,
              backgroundColor: 'white',
              display: 'flex',
              justifyContent: 'space-between',
              border: '4px solid #17408b',
            }}
          >
            <span>{teamNames[props.match.winnerId as string]}</span>
          </div>
        )
      }
      matchingResultRenderer={(props) => (
        <div
          style={{
            position: 'relative',
            left: -50,
            width: 180,
            padding: '2px 6px',
            fontSize: 14,
            backgroundColor: 'white',
            display: 'flex',
            justifyContent: 'space-between',
            border: '4px solid',
            borderColor: props.isWinner ? '#17408b' : '#ccc',
          }}
        >
          <span>{teamNames[props.result.id]}</span>
          <span style={{}}>{props.result.wins}</span>
        </div>
      )}
      treeLinksLayerProps={{
        strokeWidth: 5,
        stroke: '#ccc',
      }}
      winnerLinksLayerProps={{
        strokeWidth: 5,
        stroke: '#17408b',
      }}
    />
  </div>
);
export default Basketball;
