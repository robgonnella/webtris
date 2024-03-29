### <p style="text-align: center;">Webtris!</p>

![](./static/resources/tetris-icon2.png)

**<p style="text-align: center;">Tetris as a react component!</p>**

### Usage

Add dependency to your package.json file:

```
  "webtris": "https://github.com/robgonnella/webtris.git"
```

Render the react component:

```ts
import { WebTris, WebTrisProps } from 'webtris';

class MyApp extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const props: WebTrisProps = {
      rotateLeftKey: 'Control',
      rotateRightKey: 'Meta',
      moveLeftKey: 'ArrowLeft',
      moveRightKey: 'ArrowRight',
      moveDownKey: 'ArrowDown',
      pauseKey: 'Escape',
      tetrisThemeSrc: 'audio/theme.mp3',
      rotateAudioSrc: 'audio/rotate.mp3',
      lineRemovalAudioSrc: 'audio/remove.mp3',
      lineRemoval4AudioSrc: 'audio/removal4.mp3',
      hitAudioSrc: 'audio/hit.mp3',
      backgroundImage: 'images/background.png',
      blockWidth: 20
    };
    return <WebTris {...props} />;
  }
}
```

Required Props:
- rotateLeftKey - string: String value of the key to rotate pieces left
- rotateRightKey - string: String value of the key to rotate pieces right
- moveLeftKey - string: String value of the key to move pieces left
- moveRightKey - string: String value of the key to move pieces right
- moveDownKey - string: String value of the key to move pieces down
- pauseKey - string: String value of the key to pause game
  
Optional Props:
- style - React.CSSProperties: specify extra styling for the main component
- blockWidth - number: determines the overall size of the same: default = 15;
- backgroundImage - string: set a background image;
- tetrisThemeSrc: string: audio file source for game play music
- rotateAudioSrc - string: audio file source for rotation sound
- lineRemovalAudioSrc - string: audio file source for single line cleared sound
- lineRemoval4AudioSrc - string: audio file source for a tetris!
- hitAudioSrc - string: audio file source for when a block lands
