### <p style="text-align: center;">Webtris!</p>

![](./static/resources/tetris-icon2.png)

**<p style="text-align: center;">Tetris as a react component!</p>**

### Usage

```javascript
import Webtris from 'webtris';

const props = {
  tetrisThemeSrc: 'audio/theme.mp3',
  rotateAudioSrc: 'audio/rotate.mp3',
  lineRemovalAudioSrc: 'audio/remove.mp3',
  lineRemoval4AudioSrc: 'audio/removal4.mp3',
  hitAudioSrc: 'audio/hit.mp3',
  backgroundImage: 'images/background.png',
  blockWidth: 20
};

class MyApp extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return <Webtris {...props} />;
  }
}
```
