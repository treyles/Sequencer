Tone.Buffer.loaded

var ticks = 16;
var stepNum = 1;

Tone.Transport.bpm.value = 200;
Tone.Transport.start();
var soundOutput = new Tone.Gain().toMaster()

// TODO: IIFE here to run init

var drumSounds = [
    // change bass name
    {name: 'bass', soundFile: 'sounds/newsounds/kick.mp3'}, 
    {name: 'snare', soundFile: 'sounds/newsounds/clap.mp3'}, 
    {name: 'low', soundFile: 'sounds/newsounds/hat.mp3'}, 
    {name: 'mid', soundFile: 'sounds/newsounds/hat-open.mp3'},
    {name: 'bass', soundFile: 'sounds/newsounds/kick.mp3'}, 
    {name: 'snare', soundFile: 'sounds/newsounds/clap.mp3'}
];

var loopSounds = [
    'sounds/newsounds/crackle.wav',
    'sounds/newsounds/alicepad1.wav',
    'sounds/newsounds/alicepad2.wav',
    'sounds/newsounds/bass-line1.wav',
    'sounds/newsounds/bass-line2.wav'
];

var altDrumSounds = [
    'sounds/newsounds/altdrum/lofikick.wav',
    'sounds/newsounds/altdrum/lofisnare.wav',
    'sounds/newsounds/altdrum/lofihat.wav'
];

// extract soundFiles
var soundFileArray = drumSounds.map(function(obj) {
    return obj.soundFile;
});

// convert sounds as tone.js samples and store
var storeDrumSounds = [];
var storeAltDrumSounds = [];

// sounds queued for playback
var mainPlayer = [];


function checkoutSoundGroup (group, toArray) {
    for (var i = 0; i < group.length; i++) {
        toArray[i] = new Tone.Sampler(group[i]);
        toArray[i].connect(soundOutput);
    }
};

checkoutSoundGroup(soundFileArray, storeDrumSounds);
checkoutSoundGroup(soundFileArray, mainPlayer);
checkoutSoundGroup(altDrumSounds, storeAltDrumSounds);

// drum volume, delete later
for (var i = 0; i < mainPlayer.length; i++) {
    mainPlayer[i].volume.value = -10;
}




/**
 * Make Grid
 */

var grid = document.getElementById('grid');

// make div for each sound
for (var i = 0; i < drumSounds.length; i++) {
    var soundDiv = document.createElement('div');

    soundDiv.setAttribute('id', drumSounds[i].name);
    grid.appendChild(soundDiv);
}

// make ticks.length row of beats for each sound
for (var i = 0; i < grid.children.length; i++) {
    for (var j = 1; j < ticks + 1; j++) {
        var btn = document.createElement('div');

        btn.classList.add('beat', drumSounds[i].name, j);
        grid.children[i].appendChild(btn);

        btn.addEventListener('click', function(){
            this.classList.toggle('on');
        });
    }
}

/**
 * Sequencer
 */


// loop sequence

var sequence = new Tone.Sequence(function(time) {
    var beat = document.querySelectorAll('.beat'); // declare at top
    
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
    for (var i = 0; i < drumSounds.length; i++) {
        // loop through nodeList
        for (var j = 0; j < beat.length; j++) {
            // TODO: get multiple class names with .split

            // OR, just (.name.on.alt)..
            // how do sounds play simultaneously?
            var hasSoundName = beat[j].classList.contains(drumSounds[i].name);
            var hasStep = beat[j].classList.contains(stepNum);
            var hasOn = beat[j].classList.contains('on');
            var hasAlt = beat[j].classList.contains('alt'); 
            

            if (hasSoundName && hasStep && hasOn) {
                mainPlayer[i].triggerAttack(0, time, 1);
            }
        }       
    }

    // reset stepNum at end of sequence to repeat
    stepNum++

    if (stepNum > ticks) {
        stepNum = 1;
    }
}, drumSounds, '8n').start();


/**
 * Loop
*/

// TODO: combine with multiPlayer and put in object?

// Loop sound library
var loopPlayer = new Tone.MultiPlayer(loopSounds, function() {
    loopPlayer.start();
}).connect(soundOutput);

// vinyl loop
var vinyl = new Tone.Loop(function(time) {
    loopPlayer.start(0, time, 0);
}, '2m');

// melody loop
var melody = new Tone.Loop(function(time) {
    loopPlayer.start(1, time, 0);
}, '1m');

// bass loop, loops through two bass parts
var bassPart = 0;
var bassLine = new Tone.Sequence(function(time) {
    if (bassPart < 1) {
        loopPlayer.start(3, time, 0);
        bassPart++;
    } else {
        loopPlayer.start(4, time, 0);
        bassPart = 0;
    } 
}, [1, 2], '8m');



// loop menu
var loopUl = document.querySelector('#loop');
loopUl.addEventListener('click', function(e) {
    var eTarget = e.target.classList;
    var targetVinyl = eTarget.contains('vinyl');
    var targetMelody = eTarget.contains('melody');
    var targetBass = eTarget.contains('bass-line');
    var hasPlay = eTarget.contains('play')
    var togglePlay = eTarget.toggle('play');

    if (targetVinyl) {
        if (hasPlay) {
            vinyl.stop();
        } else {
            vinyl.start('@1m');
        }
    }
    if (targetMelody) {
        if (hasPlay) {
            melody.stop()
        } else {
            melody.start('@1m');
        }
    }
    if (targetBass) {
        if (hasPlay) {
            bassLine.stop()
            bassPart = 0;
        } else {
           bassLine.start('@2m') 
        }
    }
    if (targetMelody) {
        if (hasPlay) {
            melody.stop()
        } else {
            melody.start('@1m');
        }
    }
    togglePlay;
});


// drum menu
var drumsUl = document.querySelector('#drums');
drumsUl.addEventListener('click', function(e) {
    var eTarget = e.target.classList;
    var targetKick = eTarget.contains('kick-alt');
    var targetSnare = eTarget.contains('snare-alt');
    var targetHat = eTarget.contains('hat-alt');
    var targetSwing = eTarget.contains('swing');
    var hasPlay = eTarget.contains('play')
    var togglePlay = eTarget.toggle('play');

    if (targetKick) {
        if (hasPlay) {
            mainPlayer.splice(0, 1, storeDrumSounds[0]);
        } else {
            mainPlayer.splice(0, 1, storeAltDrumSounds[0]);
            this.classList.add('play')
        }
    }
    if (targetSnare) {
        if (hasPlay) {
            mainPlayer.splice(1, 1, storeDrumSounds[1]);
        } else {
            mainPlayer.splice(1, 1, storeAltDrumSounds[1]);
            this.classList.add('play')
        }
    }
    if (targetHat) {
        if (hasPlay) {
            mainPlayer.splice(2, 1, storeDrumSounds[2]);
        } else {
            mainPlayer.splice(2, 1, storeAltDrumSounds[2]);
            this.classList.add('play')
        }
    }
    if (targetSwing) {
        if (hasPlay) {
            Tone.Transport.swing = 0;
        } else {
            Tone.Transport.swing = 0.6;
            this.classList.add('play')
        }
    }
    togglePlay;
});






// keypress'
window.addEventListener("keydown", function(e) {
    console.log(e.keycode)
    if (e.keyCode == "32") {
        Tone.Transport.stop();
    }
    if (e.keyCode == "80") {
        loopPlayer.start(2);
    }
    if (e.keyCode == "79") {
        loopPlayer.start(1);
    }
});
 



/*function loadSamples() {
  for(var i=0; i<samples.length; i++) {
    players[i] = new Tone.Sampler(samples[i], function() {
      loadedSamples++;
    });
    players[i].connect(gain);
  }
}*/






