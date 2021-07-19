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
      leafDistance={32}
      groupDistance={8}
      leafPadding={0}
      rootPadding={50}
      boardSize={800}
      ascenderLinkLengthRatio={0.8}
      descenderLinkLengthRatio={0.2}
      nodeRenderer={(props) =>
        props.isRoot && (
          <div
            style={{
              position: 'relative',
              width: 160,
              padding: '0 6px',
              fontSize: 16,
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
            width: 160,
            padding: '0 6px',
            fontSize: 16,
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
