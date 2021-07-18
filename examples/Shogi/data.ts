export const competitors = [
  [
    [[[[{ id: 'a', name: '羽生善治九段' }]]]],
    [
      [[[{ id: 'b', name: '佐藤康光九段' }]]],
      [
        [[{ id: 'c', name: ' 木村一基王位' }]],
        [
          [{ id: 'd', name: '石井健太郎六段' }],
          [
            { id: 'e', name: '梶浦宏孝六段' },
            { id: 'f', name: '高野智史五段' },
          ],
        ],
      ],
    ],
  ],
  [
    [
      [
        [[{ id: 'g', name: '久保利明九段' }]],
        [[{ id: 'h', name: '佐々木勇気七段' }]],
      ],
    ],
    [
      [
        [[{ id: 'i', name: '丸山忠久九段' }]],
        [[{ id: 'j', name: '藤井聡太棋聖' }]],
      ],
      [[[{ id: 'k', name: '佐藤和俊七段' }]]],
    ],
  ],
];

export const matches = [
  {
    result: [{ id: 'e' }, { id: 'f' }],
    winnerId: 'e',
  },
  {
    result: [{ id: 'd' }, { id: 'e' }],
    winnerId: 'e',
  },
  {
    result: [{ id: 'c' }, { id: 'e' }],
    winnerId: 'e',
  },
  {
    result: [{ id: 'b' }, { id: 'e' }],
    winnerId: 'e',
  },
  {
    result: [{ id: 'a' }, { id: 'e' }],
    winnerId: 'a',
  },
  {
    result: [{ id: 'g' }, { id: 'h' }],
    winnerId: 'g',
  },
  {
    result: [{ id: 'i' }, { id: 'j' }],
    winnerId: 'i',
  },
  {
    result: [{ id: 'i' }, { id: 'k' }],
    winnerId: 'i',
  },
  {
    result: [{ id: 'g' }, { id: 'i' }],
    winnerId: 'i',
  },
  {
    result: [{ id: 'a' }, { id: 'i' }],
    winnerId: 'a',
  },
];
