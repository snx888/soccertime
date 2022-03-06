# soccertime
a vanilla js webapp providing a 5min timer synced to a real clock

[live site](https://snx888.github.io/soccertime/)

### functionality
- display analog clock
- manipulate time by swipe
- start timer aligned to the next 5 minute block
- display timer as circular progress bar
- play timer end sound (beep, beep, beep, whistle)
- keep screen awake while timer is running
- set random theme (color only) on app load

### used libraries and ressources
- [HammerJS](https://hammerjs.github.io/)
- [Google Fonts](https://fonts.google.com/) (Indie Flower, ~~Permanent Marker, Roboto,~~ Material Icons)
- ~~[NoSleep.js](https://github.com/richtr/NoSleep.js)~~

### release change info
- v0.7 ...
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
