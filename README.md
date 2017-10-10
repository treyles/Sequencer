# Polytone

A minimal sound sequencer and animation experiment. My first javascript app.

Inspired by:
* [Patatap](http://www.patatap.com)
* [Wassily Kandinsky](https://www.google.com/search?q=wassily+kandinsky&source=lnms&tbm=isch&sa=X&ved=0ahUKEwj33-e2veXWAhVr2IMKHeqqCLgQ_AUICigB&biw=1478&bih=856)
* [Shiny Drum Machine](http://webaudiodemos.appspot.com/MIDIDrums/index.html)

## Built With

* [Tone.js](https://github.com/Tonejs/Tone.js) - used primarily to handle sound buffers and musical timing
* [Anime.js](https://github.com/juliangarnier/anime) - used for playback controls and SVG line drawing

## Known Issues and Limitations

* Internet Explorer doesn't support Web Audio API which Tone.js is built on
* Bug that keeps app from loading in earlier versions of Firefox
* Animations are CPU intensive and not as performant as I would like them to be. Need to do some research...

## Todo

* Re-engineer sequencer. Currently, it loops through a large NodeList at each step in the sequence which is inefficient.
I suspect this is what is causing the performance issue
* Replace placeholder sounds
* Build mobile friendly version of app
