var ticks = 16;
var stepNum = 1;

Tone.Transport.bpm.value = 120;
Tone.Transport.start();

// TODO: IIFE here to run init

var sounds = [
    {name: 'bass', soundFile: 'sounds/newsounds/kick.mp3'}, 
    {name: 'snare', soundFile: 'sounds/newsounds/clap.mp3'}, 
    {name: 'low', soundFile: 'sounds/newsounds/hat.mp3'}, 
    {name: 'mid', soundFile: 'sounds/newsounds/hat-open.mp3'},
    {name: 'bass', soundFile: 'sounds/newsounds/kick.mp3'}, 
    {name: 'snare', soundFile: 'sounds/newsounds/clap.mp3'}
];

// get soundFiles to pass as a new array in multiPlayer
var soundFileArray = sounds.map(function(obj) {
    return obj.soundFile;
});

/**
 * Make Grid
 */

var grid = document.getElementById('grid');

// make div for each sound
for (var i = 0; i < sounds.length; i++) {
    var soundDiv = document.createElement('div');

    soundDiv.setAttribute('id', sounds[i].name);
    grid.appendChild(soundDiv);
}

// make ticks.length row of beats for each sound
for (var i = 0; i < grid.children.length; i++) {
    for (var j = 1; j < ticks + 1; j++) {
        var btn = document.createElement('div');

        btn.classList.add('beat', sounds[i].name, j);
        grid.children[i].appendChild(btn);

        btn.addEventListener('click', function(){
            this.classList.toggle('on');
        });
    }
}

/**
 * Sequencer
 */

// tone.js effects, output audio goes through here
var delay = new Tone.PingPongDelay("8n", 0.5).toMaster();

// tone.js multiplayer, Loads samples and handles buffers
var multiPlayer = new Tone.MultiPlayer(soundFileArray, function() {
    multiPlayer.start();
}).connect(delay);

var loop = new Tone.Sequence(function(time) {
    var beat = document.querySelectorAll('.beat');
    
    // animate steps
    // loop through nodeList
    for (var i = 0; i < beat.length; i++) {
        var currentBeat = beat[i].classList; 

        currentBeat.remove('step');
        if (currentBeat.contains(stepNum)) {
            currentBeat.add('step');
        }
    }

    // play sounds
    for (var i = 0; i < sounds.length; i++) {
        // loop through nodeList
        for (var j = 0; j < beat.length; j++) {
            // TODO: get multiple class names with .split
            var hasSoundName = beat[j].classList.contains(sounds[i].name);
            var hasStep = beat[j].classList.contains(stepNum);
            var hasOn = beat[j].classList.contains('on'); 
            
            if (hasSoundName && hasStep && hasOn) {
                multiPlayer.start(i, time, 0);      
            }
        }       
    }

    // reset stepNum at end of sequence to repeat
    stepNum++

    if (stepNum > ticks) {
        stepNum = 1;
    }
}, sounds, "8n").start();







