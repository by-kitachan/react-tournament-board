# react-tournament-board

[![npm][version-shield]][version-url]
[![MIT License][license-shield]][license-url]

[![React tournament board](https://repository-images.githubusercontent.com/378298545/9b654faa-9471-45f5-a5bc-4f4a03eeefc3)](https://spring-raining.github.io/react-tournament-board/)

## Installation

```sh
npm install react-tournament-board
```

or

```sh
yarn add react-tournament-board
```

<!-- USAGE EXAMPLES -->
## Usage

```jsx
import { TournamentBoard } from 'react-tournament-board';
import 'react-tournament-board/style.css'; // import styles

<TournamentBoard
  competitor={[
    [
      { id: 'a' },
      [{ id: 'b' }, { id: 'c' }, { id: 'd' }],
      [{ id: 'e' }, { id: 'f' }],
    ],
    [{ id: 'g' }, [{ id: 'h' }, { id: 'i' }]],
  ]}
  matches={[
    {
      result: [{ id: 'b' }, { id: 'c' }, { id: 'd' }],
      winnerId: 'b',
    },
    {
      result: [{ id: 'e' }, { id: 'f' }],
      winnerId: 'f',
    },
    {
      result: [{ id: 'b' }, { id: 'f' }],
      winnerId: 'b',
    },
  ]}
  nodeRenderer={(props) => <div>{props.isLeaf && props.competitor.id}</div>}
  treeLinksLayerProps={{
    stroke: 'silver',
    strokeWidth: 2,
  }}
  winnerLinksLayerProps={{
    stroke: 'magenta',
    strokeWidth: 4,
  }}
  direction="horizontal"
/>
```

### Props of `<TournamentBoard />`

```ts
export interface TournamentBoardProps {
  competitor: MatchingStructure<T>;
  matches?: MatchingResult<U>[];
  nodeRenderer?: (props: NodeRendererProps) => React.ReactNode;
  matchingResultRenderer?: (
    props: MatchingResultRendererProps,
  ) => React.ReactNode;
  treeLinksLayerProps?: React.SVGProps<SVGGElement>;
  winnerLinksLayerProps?: React.SVGProps<SVGGElement>;
  direction?: 'vertical' | 'horizontal';
  boardSize?: number;
  descenderLinkLengthRatio?: number;
  ascenderLinkLengthRatio?: number;
  leafDistance?: number;
  groupDistance?: number;
  leafPadding?: number;
  rootPadding?: number;
  bidirectionalTree?: boolean;
}
```

<!-- ROADMAP -->
## Roadmap

See the [open issues](https://github.com/spring-raining/react-tournament-baord/issues) for a list of proposed features (and known issues).

## Contributing

Contributions are what make the open source community such an amazing place to be learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request



## License

Distributed under the MIT License. See `LICENSE` for more information.



## Contact

© spring-raining - https://github.com/spring-raining - harusamex.com@gmail.com

Project Link: https://github.com/spring-raining/react-tournament-baord




<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->
[version-shield]: https://img.shields.io/npm/v/react-tournament-board.svg?style=flat-square
[version-url]: https://www.npmjs.com/package/react-tournament-board
[license-shield]: https://img.shields.io/github/license/spring-raining/react-tournament-board.svg?style=flat-square
[license-url]: https://github.com/spring-raining/react-tournament-board/blob/main/LICENSE.txt
