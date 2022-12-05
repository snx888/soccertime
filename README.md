# soccertime
a vanilla js webapp providing a 5min timer synced to a real clock and selecting players present setting up teams for 3on3 games

[live site](https://snx888.github.io/soccertime/)

### functionality
- select players present
- display teams and games
- display digital clock
- manipulate time by swipe
- start timer aligned to the next 5 minute block
- display timer with a fullscreen progress bar
- change progress bar color if one minute left
- play timer end sound (beep, beep, beep, whistle)
- keep screen awake while timer is running

### used libraries and ressources
- [Google Fonts](https://fonts.google.com/) (Gruppo, Material Icons)
- ~~[NoSleep.js](https://github.com/richtr/NoSleep.js)~~

### release change info
- v0.8 ...
- v0.7 2022/12/05
  - complete redesgin
    - replaced analog clock by a digital one
    - replaced circular progress bar by a fullscreen linear one
    - added player management
    - added round control (games and teams)
    - removed theme handling
  - fixed issue #009 (window blur stops wakelock)
- v0.6 2022/03/06
  - fixed issue #008 (timeout stop/delay on device sleep)
  - folder structure rearranged
  - moved version info and todo to this document and issues
  - fix bottom button position
- v0.5 2022/02/28
  - resize and rearrage items
  - headlines removed
  - added sound and wakelock indicator
  - added clock tick and optimized slide sensitivity
  - added themes and pick them randomly
  - added some animations
- v0.4 2022/02/25
  - added wakelock
- v0.3 2022/02/25
  - first user test
