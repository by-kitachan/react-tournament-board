import { match } from 'assert';
import React from 'react';
import { TournamentBoard } from '../../src/components/TournamentBoard';
import { competitors } from './data';

const SmashBros: React.VFC = () => (
  <div
    style={{
      width: '100%',
      padding: '2rem 0',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      background: '#1d1929',
      color: 'white',
    }}
  >
    <h2>Smash Bros</h2>
    <TournamentBoard
      competitor={competitors}
      direction="vertical"
      bidirectionalTree
      boardSize={600}
      leafPadding={140}
      rootPadding={40}
      leafDistance={16}
      groupDistance={4}
      nodeRenderer={(props) =>
        props.isLeaf ? (
          <div
            style={{
              width: 120,
              fontSize: 12,
              paddingInlineStart: '24px',
              textAlign: 'start',
              background: `linear-gradient(130deg, hsl(${
                -props.competitor.block * 25
              }, 80%, 50%) 15%, white 15%, white 85%, hsl(${
                -props.competitor.block * 25
              }, 80%, 50%) 85%)`,
              color: 'black',
              borderRadius: 4,
            }}
          >
            {props.competitor.id}
          </div>
        ) : (
          props.isRoot && <div style={{ fontSize: 32 }}>👑</div>
        )
      }
      treeLinksLayerProps={{
        strokeWidth: 1,
        stroke: '#eee',
      }}
    />
  </div>
);
export default SmashBros;
