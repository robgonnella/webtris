### <p style="text-align: center;">Webtris!</p>

![](./static/resources/tetris-icon2.png)

**<p style="text-align: center;">Tetris as a react component!</p>**

### Usage

Add dependency to your package.json file:

```
  "webtris": "git+https://github.com/robgonnella/webtris.git"
```

Render the react component:

```javascript
import Webtris from 'webtris';

class MyApp extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const props = {
      tetrisThemeSrc: 'audio/theme.mp3',
      rotateAudioSrc: 'audio/rotate.mp3',
      lineRemovalAudioSrc: 'audio/remove.mp3',
      lineRemoval4AudioSrc: 'audio/removal4.mp3',
      hitAudioSrc: 'audio/hit.mp3',
      backgroundImage: 'images/background.png',
      blockWidth: 20
    };
    return <Webtris {...props} />;
  }
}
```
